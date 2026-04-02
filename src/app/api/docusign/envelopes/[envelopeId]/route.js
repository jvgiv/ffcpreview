import { NextResponse } from "next/server";
import { storeDocuSignEnvelopeEvent } from "@/lib/docusign/firestore";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";

export const runtime = "nodejs";

function validatePayload(body) {
  const sessionEndType = body?.sessionEndType?.trim();

  if (!sessionEndType) {
    return "A DocuSign session end type is required.";
  }

  return {
    sessionEndType,
  };
}

export async function PATCH(request, context) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const { envelopeId } = await context.params;
    const body = await request.json();
    const validated = validatePayload(body);

    if (typeof validated === "string") {
      return NextResponse.json({ error: validated }, { status: 400 });
    }

    await storeDocuSignEnvelopeEvent({
      envelopeId,
      requestUser,
      sessionEndType: validated.sessionEndType,
    });

    return NextResponse.json({ ok: true });
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

    console.error("Unexpected DocuSign Firestore update error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while updating the DocuSign envelope record.",
      },
      { status: 500 }
    );
  }
}
