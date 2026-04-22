import { NextResponse } from "next/server";
import { listAllSignedDocuSignEnvelopes } from "@/lib/docusign/firestore";
import { FirebaseAdminConfigurationError } from "@/lib/firebase/admin";
import { buildUserMetrics, listAllUsersSummary } from "@/lib/firebase/adminUsers";
import {
  FirebaseAuthenticationError,
  requireFirebaseUserRole,
} from "@/lib/firebase/serverAuth";
import { USER_ROLES } from "@/lib/firebase/userRoles";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    await requireFirebaseUserRole(request, [USER_ROLES.ADMIN]);
    const users = await listAllUsersSummary();
    const signedDocuments = await listAllSignedDocuSignEnvelopes();
    const userMetrics = buildUserMetrics(users);

    return NextResponse.json({
      metrics: {
        ...userMetrics,
        signedDocumentsCount: signedDocuments.length,
      },
      users,
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

    console.error("Unexpected admin dashboard error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while loading the admin dashboard.",
      },
      { status: 500 }
    );
  }
}