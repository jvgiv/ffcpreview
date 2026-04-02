import { NextResponse } from "next/server";
import { downloadCombinedEnvelopeDocument } from "@/lib/docusign/documents";
import { getUserDocuSignEnvelope } from "@/lib/docusign/firestore";
import {
  DocuSignApiError,
  DocuSignConfigurationError,
  DocuSignConsentRequiredError,
} from "@/lib/docusign/errors";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";

export const runtime = "nodejs";

export async function GET(request, context) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const { envelopeId } = await context.params;
    const envelope = await getUserDocuSignEnvelope({
      uid: requestUser.uid,
      envelopeId,
    });

    if (!envelope) {
      return NextResponse.json(
        {
          error: "That DocuSign envelope was not found for the current user.",
        },
        { status: 404 }
      );
    }

    const document = await downloadCombinedEnvelopeDocument({
      envelopeId,
      accountId: envelope.docusign?.accountId,
      fileLabel: envelope.agreementTitle,
    });

    return new NextResponse(document.bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${document.filename}"`,
        "Cache-Control": "private, no-store",
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

    console.error("Unexpected DocuSign document download error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while downloading the DocuSign document.",
      },
      { status: 500 }
    );
  }
}
