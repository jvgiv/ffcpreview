import { NextResponse } from "next/server";
import { listAllSignedDocuSignEnvelopes } from "@/lib/docusign/firestore";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireFirebaseUserRole,
} from "@/lib/firebase/serverAuth";
import { USER_ROLES } from "@/lib/firebase/userRoles";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    await requireFirebaseUserRole(request, [USER_ROLES.ADMIN]);
    const documents = await listAllSignedDocuSignEnvelopes();

    return NextResponse.json({
      documents,
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

    console.error("Unexpected admin signed documents error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while loading signed DocuSign documents.",
      },
      { status: 500 }
    );
  }
}