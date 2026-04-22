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

export const runtime = "nodejs";

function validatePayload(body) {
  const signerName = body?.signerName?.trim();
  const signerEmail = body?.signerEmail?.trim();
  const agreementSlug = body?.agreementSlug?.trim();

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

  return {
    signerName,
    signerEmail,
    agreementSlug: agreement.slug,
    agreementTitle: agreement.agreementTitle,
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
      requestOrigin,
      returnUrl,
    });

    await storeDocuSignEnvelopeRecord({
      envelopeId: signingSession.envelopeId,
      agreementSlug: validated.agreementSlug,
      agreementTitle: validated.agreementTitle,
      signerName: validated.signerName,
      signerEmail: validated.signerEmail,
      requestOrigin,
      returnUrl,
      docuSignSession: signingSession.docuSignSession,
      requestUser,
    });

    return NextResponse.json(signingSession);
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
