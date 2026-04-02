import "server-only";

import { getAdminAuth } from "./admin";

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
      "A valid Firebase ID token is required for this DocuSign action."
    );
  }

  return token;
}

export async function requireVerifiedFirebaseUser(request) {
  const token = getBearerToken(request);
  const decodedToken = await getAdminAuth().verifyIdToken(token);

  return {
    uid: decodedToken.uid,
    email: decodedToken.email || "",
    name: decodedToken.name || "",
  };
}
