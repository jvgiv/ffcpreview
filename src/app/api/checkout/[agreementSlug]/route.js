import { NextResponse } from "next/server";
import { getAgreementBySlug } from "@/lib/agreements";
import { listUserDocuSignEnvelopes } from "@/lib/docusign/firestore";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";
import { getPurchaseBySlug, isPaymentComplete } from "@/lib/purchases";
import { getUserPaymentSummary } from "@/lib/paypal/firestore";

export const runtime = "nodejs";

function findLatestSignedEnvelope(documents, purchase) {
  return documents.find(
    (document) =>
      document.isSigned &&
      (document.agreementSlug === purchase.agreementSlug ||
        document.agreementTitle === purchase.agreementTitle)
  );
}

export async function GET(request, { params }) {
  try {
    const { agreementSlug } = await params;
    const requestUser = await requireVerifiedFirebaseUser(request);
    const purchase = getPurchaseBySlug(agreementSlug);
    const agreement = getAgreementBySlug(agreementSlug);

    if (!purchase || !agreement) {
      return NextResponse.json(
        {
          error: "The requested checkout package could not be found.",
        },
        { status: 404 }
      );
    }

    const [documents, paymentSummary] = await Promise.all([
      listUserDocuSignEnvelopes({
        uid: requestUser.uid,
        limit: 100,
      }),
      getUserPaymentSummary({
        uid: requestUser.uid,
        agreementSlug: purchase.agreementSlug,
      }),
    ]);
    const signedEnvelope = findLatestSignedEnvelope(documents, purchase);

    return NextResponse.json({
      purchase,
      agreement: {
        slug: agreement.slug,
        title: agreement.agreementTitle,
        packageName: agreement.packageName,
        ctaLabel: agreement.ctaLabel,
      },
      signing: {
        isSigned: Boolean(signedEnvelope),
        envelopeId: signedEnvelope?.envelopeId || "",
        status: signedEnvelope?.status || "",
        completedAt: signedEnvelope?.completedAt || null,
      },
      payment: {
        ...(paymentSummary || {}),
        isPaid: isPaymentComplete(paymentSummary?.status),
      },
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

    console.error("Unexpected checkout status error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while loading the checkout status.",
      },
      { status: 500 }
    );
  }
}
