import { NextResponse } from "next/server";
import { listUserDocuSignEnvelopes } from "@/lib/docusign/firestore";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const documents = await listUserDocuSignEnvelopes({
      uid: requestUser.uid,
    });

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

    console.error("Unexpected DocuSign envelope list error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while loading DocuSign documents.",
      },
      { status: 500 }
    );
  }
}
