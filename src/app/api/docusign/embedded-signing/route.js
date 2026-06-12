import { NextResponse } from "next/server";
import { createEmbeddedSigningSession } from "@/lib/docusign/esign";
import { getDocuSignSigningReturnUrl } from "@/lib/docusign/config";
import { storeDocuSignEnvelopeRecord } from "@/lib/docusign/firestore";
import {
  DocuSignApiError,
  DocuSignConfigurationError,
  DocuSignConsentRequiredError,
} from "@/lib/docusign/errors";
import {
  FirebaseAdminConfigurationError,
} from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";
import { getAgreementBySlug } from "@/lib/agreements";
import { buildCheckoutPurchase } from "@/lib/purchases";

export const runtime = "nodejs";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function validatePayload(body) {
  const signerName = normalizeText(body?.signerName);
  const signerEmail = normalizeEmail(body?.signerEmail);
  const agreementSlug = normalizeText(body?.agreementSlug);

  if (!signerName) {
    return "Signer name is required.";
  }

  if (!signerEmail) {
    return "Signer email is required.";
  }

  if (!agreementSlug) {
    return "Agreement selection is required.";
  }

  const agreement = getAgreementBySlug(agreementSlug);

  if (!agreement) {
    return "The selected agreement could not be found.";
  }

  const clientStreetAddress = normalizeText(body?.clientStreetAddress);
  const clientCityStateZip = normalizeText(body?.clientCityStateZip);

  if (!clientStreetAddress) {
    return "Client street address is required.";
  }

  if (!clientCityStateZip) {
    return "Client city, state, and zip code are required.";
  }

  const purchase = buildCheckoutPurchase({
    agreementSlug: agreement.slug,
    additionalPlanTier: body?.additionalPlanTier,
    additionalCount: body?.additionalCount,
  });

  if (!purchase) {
    return "The selected checkout package could not be resolved.";
  }

  const checkout = {
    basePlanTier: purchase.basePlanTier,
    additionalPlanTier: purchase.additionalPlanTier,
    additionalCount: purchase.additionalCount,
    purchase,
    client: {
      streetAddress: clientStreetAddress,
      cityStateZip: clientCityStateZip,
    },
    orienteers: [
      {
        name: normalizeText(body?.primaryOrienteerName),
        phone: normalizeText(body?.primaryOrienteerPhone),
        email: normalizeEmail(body?.primaryOrienteerEmail),
      },
      {
        name: normalizeText(body?.secondaryOrienteerName),
        phone: normalizeText(body?.secondaryOrienteerPhone),
        email: normalizeEmail(body?.secondaryOrienteerEmail),
      },
    ],
  };

  return {
    signerName,
    signerEmail,
    agreementSlug: agreement.slug,
    agreementTitle: agreement.agreementTitle,
    checkout,
  };
}

export async function POST(request) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const body = await request.json();
    const validated = validatePayload(body);

    if (typeof validated === "string") {
      return NextResponse.json({ error: validated }, { status: 400 });
    }

    const requestOrigin = request.headers.get("origin") || new URL(request.url).origin;
    const returnUrl = getDocuSignSigningReturnUrl(requestOrigin);
    const signingSession = await createEmbeddedSigningSession({
      signerName: validated.signerName,
      signerEmail: validated.signerEmail,
      agreementSlug: validated.agreementSlug,
      checkout: validated.checkout,
      requestOrigin,
      returnUrl,
    });

    await storeDocuSignEnvelopeRecord({
      envelopeId: signingSession.envelopeId,
      agreementSlug: validated.agreementSlug,
      agreementTitle: validated.agreementTitle,
      checkout: validated.checkout,
      signerName: validated.signerName,
      signerEmail: validated.signerEmail,
      requestOrigin,
      returnUrl,
      docuSignSession: signingSession.docuSignSession,
      requestUser,
    });

    return NextResponse.json({
      ...signingSession,
      purchase: validated.checkout.purchase,
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

    if (error instanceof DocuSignConfigurationError) {
      return NextResponse.json(
        {
          error: error.message,
          missing: error.missing,
        },
        { status: 500 }
      );
    }

    if (error instanceof DocuSignConsentRequiredError) {
      return NextResponse.json(
        {
          error: error.message,
          consentRequired: true,
          consentUrl: error.consentUrl,
        },
        { status: 428 }
      );
    }

    if (error instanceof DocuSignApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status }
      );
    }

    console.error("Unexpected DocuSign embedded signing error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while starting the DocuSign signing session.",
      },
      { status: 500 }
    );
  }
}
