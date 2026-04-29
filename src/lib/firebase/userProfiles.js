import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDb } from "./firestore";
import {
  DEFAULT_USER_ROLE,
  isRecognizedUserRole,
  normalizeUserRole,
} from "./userRoles";

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function firstAvailableText(...values) {
  for (const value of values) {
    const normalizedValue = normalizeText(value);

    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return "";
}

function serializeTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return typeof value === "string" ? value : null;
}

function buildResolvedPaymentSummary(paymentSummary) {
  if (!paymentSummary || typeof paymentSummary !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(paymentSummary).map(([agreementSlug, summary]) => [
      agreementSlug,
      {
        ...(summary || {}),
        completedAt: serializeTimestamp(summary?.completedAt),
        updatedAt: serializeTimestamp(summary?.updatedAt),
        createdAt: serializeTimestamp(summary?.createdAt),
      },
    ])
  );
}

function buildUserProfileRecord(user, profile = {}, existingProfile = null) {
  const displayName = firstAvailableText(
    profile.displayName,
    existingProfile?.displayName,
    user.displayName
  );
  const phoneNumber = firstAvailableText(
    profile.phoneNumber,
    existingProfile?.phoneNumber,
    user.phoneNumber
  );
  const zipCode = firstAvailableText(profile.zipCode, existingProfile?.zipCode);
  const ageRange = firstAvailableText(profile.ageRange, existingProfile?.ageRange);

  return {
    uid: user.uid,
    email: firstAvailableText(user.email, profile.email, existingProfile?.email),
    role: normalizeUserRole(profile.role || existingProfile?.role || DEFAULT_USER_ROLE),
    ...(displayName ? { displayName } : {}),
    ...(phoneNumber ? { phoneNumber } : {}),
    ...(zipCode ? { zipCode } : {}),
    ...(ageRange ? { ageRange } : {}),
    updatedAt: serverTimestamp(),
  };
}

export function buildResolvedFirebaseUserProfile(user, ...profiles) {
  const resolvedProfile = profiles.reduce(
    (currentProfile, profile) => ({
      ...currentProfile,
      ...(profile || {}),
    }),
    {}
  );

  return {
    uid: user.uid,
    email: firstAvailableText(resolvedProfile.email, user.email),
    displayName: firstAvailableText(resolvedProfile.displayName, user.displayName),
    phoneNumber: firstAvailableText(resolvedProfile.phoneNumber, user.phoneNumber),
    zipCode: firstAvailableText(resolvedProfile.zipCode),
    ageRange: firstAvailableText(resolvedProfile.ageRange),
    role: normalizeUserRole(resolvedProfile.role || DEFAULT_USER_ROLE),
    paymentSummary: buildResolvedPaymentSummary(resolvedProfile.paymentSummary),
  };
}

function shouldBackfillUserProfile(existingProfile, user) {
  if (!existingProfile) {
    return true;
  }

  if (!isRecognizedUserRole(existingProfile.role)) {
    return true;
  }

  if (!normalizeText(existingProfile.email) && normalizeText(user.email)) {
    return true;
  }

  if (!normalizeText(existingProfile.displayName) && normalizeText(user.displayName)) {
    return true;
  }

  return false;
}

export async function syncFirebaseUserProfile(user, profile = {}) {
  const userProfileRef = doc(getDb(), "users", user.uid);
  const userProfileSnapshot = await getDoc(userProfileRef);
  const existingProfile = userProfileSnapshot.exists() ? userProfileSnapshot.data() : null;
  const profileRecord = buildUserProfileRecord(user, profile, existingProfile);

  if (!userProfileSnapshot.exists()) {
    profileRecord.createdAt = serverTimestamp();
  }

  await setDoc(userProfileRef, profileRecord, { merge: true });

  return buildResolvedFirebaseUserProfile(user, existingProfile, profileRecord);
}

export async function ensureFirebaseUserProfile(user) {
  const userProfileRef = doc(getDb(), "users", user.uid);
  const userProfileSnapshot = await getDoc(userProfileRef);

  if (!userProfileSnapshot.exists()) {
    return syncFirebaseUserProfile(user);
  }

  const existingProfile = userProfileSnapshot.data() || {};

  if (!shouldBackfillUserProfile(existingProfile, user)) {
    return buildResolvedFirebaseUserProfile(user, existingProfile);
  }

  const profileRecord = buildUserProfileRecord(user, {}, existingProfile);
  await setDoc(userProfileRef, profileRecord, { merge: true });

  return buildResolvedFirebaseUserProfile(user, existingProfile, profileRecord);
}

