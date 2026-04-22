import { NextResponse } from "next/server";
import {
  getUserDocuSignEnvelope,
  listUserDocuSignEnvelopes,
} from "@/lib/docusign/firestore";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";
import { createPayPalOrder, PayPalApiError } from "@/lib/paypal/api";
import { PayPalConfigurationError } from "@/lib/paypal/config";
import {
  getUserPaymentSummary,
  storePayPalOrderRecord,
} from "@/lib/paypal/firestore";
import { getPurchaseBySlug, isPaymentComplete } from "@/lib/purchases";

export const runtime = "nodejs";

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isEnvelopeForPurchase(document, purchase) {
  return Boolean(document) &&
    document.isSigned &&
    (document.agreementSlug === purchase.agreementSlug ||
      document.agreementTitle === purchase.agreementTitle);
}

async function resolveSignedEnvelope({ uid, purchase, envelopeId }) {
  const normalizedEnvelopeId = normalizeText(envelopeId);

  if (normalizedEnvelopeId) {
    const envelope = await getUserDocuSignEnvelope({
      uid,
      envelopeId: normalizedEnvelopeId,
    });

    return isEnvelopeForPurchase(envelope, purchase) ? envelope : null;
  }

  const documents = await listUserDocuSignEnvelopes({ uid, limit: 100 });
  return (
    documents.find((document) => isEnvelopeForPurchase(document, purchase)) || null
  );
}

export async function POST(request) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const body = await request.json();
    const agreementSlug = normalizeText(body?.agreementSlug);
    const purchase = getPurchaseBySlug(agreementSlug);

    if (!purchase) {
      return NextResponse.json(
        {
          error: "The requested checkout package could not be found.",
        },
        { status: 404 }
      );
    }

    const existingPayment = await getUserPaymentSummary({
      uid: requestUser.uid,
      agreementSlug: purchase.agreementSlug,
    });

    if (isPaymentComplete(existingPayment?.status)) {
      return NextResponse.json(
        {
          error: "This package has already been paid for.",
        },
        { status: 409 }
      );
    }

    const signedEnvelope = await resolveSignedEnvelope({
      uid: requestUser.uid,
      purchase,
      envelopeId: body?.envelopeId,
    });

    if (!signedEnvelope) {
      return NextResponse.json(
        {
          error: "Complete agreement signing before starting payment.",
        },
        { status: 409 }
      );
    }

    const order = await createPayPalOrder({
      purchase,
      requestUser,
      envelopeId: signedEnvelope.envelopeId,
    });

    await storePayPalOrderRecord({
      order,
      purchase,
      requestUser,
      envelopeId: signedEnvelope.envelopeId,
    });

    return NextResponse.json({
      orderId: order.id,
      status: order.status || "CREATED",
    });
  } catch (error) {
    if (error instanceof FirebaseAuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof FirebaseAdminConfigurationError) {
      return NextResponse.json(
        {
          error: error.message,
          missing: error.missing,
        },
        { status: 500 }
      );
    }

    if (error instanceof PayPalConfigurationError) {
      return NextResponse.json(
        {
          error: error.message,
          missing: error.missing,
        },
        { status: 500 }
      );
    }

    if (error instanceof PayPalApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status }
      );
    }

    console.error("Unexpected PayPal create order error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while creating the PayPal order.",
      },
      { status: 500 }
    );
  }
}
