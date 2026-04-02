import { NextResponse } from "next/server";
import {
  buildDocuSignConsentUrl,
  getDocuSignConfigStatus,
} from "@/lib/docusign/config";
import { getFirebaseAdminStatus } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  const docuSignStatus = getDocuSignConfigStatus();
  const firebaseAdminStatus = getFirebaseAdminStatus();

  return NextResponse.json({
    ...docuSignStatus,
    firestoreAdminReady: firebaseAdminStatus.ready,
    firestoreAdminMissing: firebaseAdminStatus.ready
      ? []
      : firebaseAdminStatus.missing,
    consentUrl: docuSignStatus.ready ? buildDocuSignConsentUrl() : null,
  });
}
