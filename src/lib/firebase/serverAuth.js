import "server-only";

import { getAdminAuth, getAdminDb } from "./admin";
import { isAllowedUserRole, normalizeUserRole } from "./userRoles";

export class FirebaseAuthenticationError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "FirebaseAuthenticationError";
    this.status = status;
  }
}

function getBearerToken(request) {
  const authorizationHeader = request.headers.get("authorization") || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new FirebaseAuthenticationError(
      "A valid Firebase ID token is required for this action."
    );
  }

  return token;
}

async function getFirebaseUserProfile(uid) {
  const snapshot = await getAdminDb().collection("users").doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() || null;
}

export async function requireVerifiedFirebaseUser(request) {
  const token = getBearerToken(request);
  const decodedToken = await getAdminAuth().verifyIdToken(token);
  const profile = await getFirebaseUserProfile(decodedToken.uid);

  return {
    uid: decodedToken.uid,
    email: decodedToken.email || profile?.email || "",
    name: decodedToken.name || profile?.displayName || "",
    role: normalizeUserRole(profile?.role),
    profile: profile || null,
  };
}

export async function requireFirebaseUserRole(request, allowedRoles = []) {
  const requestUser = await requireVerifiedFirebaseUser(request);

  if (!isAllowedUserRole(requestUser.role, allowedRoles)) {
    throw new FirebaseAuthenticationError(
      "You do not have permission to access this admin view.",
      403
    );
  }

  return requestUser;
}