import "server-only";

import fs from "node:fs";
import path from "node:path";
import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

export class FirebaseAdminConfigurationError extends Error {
  constructor(message, missing = []) {
    super(message);
    this.name = "FirebaseAdminConfigurationError";
    this.missing = missing;
  }
}

function normalizePrivateKey(value) {
  if (!value) {
    return "";
  }

  return value.replace(/\\n/g, "\n").trim();
}

function readServiceAccountFromPath(filePath) {
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  const contents = fs.readFileSync(resolvedPath, "utf8");

  return JSON.parse(contents);
}

function readServiceAccountFromEnv() {
  const serviceAccountPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH?.trim();
  const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON?.trim();
  const serviceAccountBase64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64?.trim();

  if (serviceAccountPath) {
    return readServiceAccountFromPath(serviceAccountPath);
  }

  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  if (serviceAccountBase64) {
    return JSON.parse(Buffer.from(serviceAccountBase64, "base64").toString("utf8"));
  }

  return null;
}

function buildServiceAccountCredentialOptions() {
  const serviceAccount = readServiceAccountFromEnv();

  if (serviceAccount) {
    return {
      credential: cert({
        projectId:
          serviceAccount.project_id ||
          serviceAccount.projectId ||
          process.env.FIREBASE_ADMIN_PROJECT_ID ||
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
        privateKey: normalizePrivateKey(
          serviceAccount.private_key || serviceAccount.privateKey
        ),
      }),
      projectId:
        serviceAccount.project_id ||
        serviceAccount.projectId ||
        process.env.FIREBASE_ADMIN_PROJECT_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    "";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim() || "";
  const privateKey = normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim());

  if (projectId && clientEmail && privateKey) {
    return {
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    };
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_PROJECT) {
    return {
      credential: applicationDefault(),
      projectId: projectId || process.env.GOOGLE_CLOUD_PROJECT,
    };
  }

  const missing = [
    "FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH or FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON or FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64",
    "or FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY",
    "or GOOGLE_APPLICATION_CREDENTIALS",
  ];

  throw new FirebaseAdminConfigurationError(
    "Firebase Admin credentials are not configured for server-side Firestore access.",
    missing
  );
}

export function getFirebaseAdminStatus() {
  try {
    buildServiceAccountCredentialOptions();

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
  if (getApps().length) {
    return getApp();
  }

  return initializeApp(buildServiceAccountCredentialOptions());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export { FieldValue };
