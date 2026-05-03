import "server-only";

import admin from "firebase-admin";

export class FirebaseAdminConfigurationError extends Error {
  constructor(message, missing = []) {
    super(message);
    this.name = "FirebaseAdminConfigurationError";
    this.missing = missing;
  }
}

function getEnvValue(...names) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function normalizePrivateKey(privateKey) {
  return privateKey.replace(/\\n/g, "\n");
}

function getFirebaseAdminConfig() {
  const projectId = getEnvValue(
    "FIREBASE_PROJECT_ID",
    "FIREBASE_ADMIN_PROJECT_ID"
  );
  const clientEmail = getEnvValue(
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_ADMIN_CLIENT_EMAIL"
  );
  const privateKey = getEnvValue(
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_ADMIN_PRIVATE_KEY"
  );
  const missing = [];

  if (!projectId) {
    missing.push("FIREBASE_PROJECT_ID or FIREBASE_ADMIN_PROJECT_ID");
  }

  if (!clientEmail) {
    missing.push("FIREBASE_CLIENT_EMAIL or FIREBASE_ADMIN_CLIENT_EMAIL");
  }

  if (!privateKey) {
    missing.push("FIREBASE_PRIVATE_KEY or FIREBASE_ADMIN_PRIVATE_KEY");
  }

  if (missing.length) {
    throw new FirebaseAdminConfigurationError(
      `Firebase Admin credentials are missing: ${missing.join(", ")}. Add these server-only environment variables in Vercel and your local environment.`,
      missing
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  };
}

export function getFirebaseAdminStatus() {
  try {
    getFirebaseAdminConfig();

    return {
      ready: true,
    };
  } catch (error) {
    if (error instanceof FirebaseAdminConfigurationError) {
      return {
        ready: false,
        missing: error.missing,
        message: error.message,
      };
    }

    throw error;
  }
}

export function getFirebaseAdminApp() {
  if (!admin.apps.length) {
    const { projectId, clientEmail, privateKey } = getFirebaseAdminConfig();

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return admin.app();
}

export function getAdminDb() {
  getFirebaseAdminApp();

  return admin.firestore();
}

export function getAdminAuth() {
  getFirebaseAdminApp();

  return admin.auth();
}

export const FieldValue = admin.firestore.FieldValue;
