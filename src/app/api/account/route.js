import { NextResponse } from "next/server";
import {
  FieldValue,
  FirebaseAdminConfigurationError,
  getAdminAuth,
  getAdminDb,
} from "@/lib/firebase/admin";
import { isValidAgeRange } from "@/lib/firebase/profileOptions";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";
import { normalizeUserRole } from "@/lib/firebase/userRoles";

export const runtime = "nodejs";

class AccountRequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "AccountRequestError";
    this.status = status;
  }
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function buildSerializedProfile({ uid, email, role, displayName, phoneNumber, zipCode, ageRange }) {
  return {
    uid,
    email,
    role,
    displayName,
    phoneNumber,
    zipCode,
    ageRange,
  };
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new AccountRequestError("Unable to read the account update payload.");
  }
}

async function deleteCollectionDocuments(collectionRef, batchSize = 200) {
  while (true) {
    const snapshot = await collectionRef.limit(batchSize).get();

    if (snapshot.empty) {
      return;
    }

    const batch = getAdminDb().batch();
    snapshot.docs.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    await batch.commit();

    if (snapshot.size < batchSize) {
      return;
    }
  }
}

async function deleteUserSubcollections(userRef) {
  const subcollections = await userRef.listCollections();

  for (const subcollection of subcollections) {
    await deleteCollectionDocuments(subcollection);
  }
}

async function deleteFirebaseAuthUser(uid) {
  try {
    await getAdminAuth().deleteUser(uid);
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      return;
    }

    throw error;
  }
}

export async function PATCH(request) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const body = await readJsonBody(request);
    const displayName = normalizeText(body?.displayName);
    const phoneNumber = normalizeText(body?.phoneNumber);
    const zipCode = normalizeText(body?.zipCode);
    const ageRange = normalizeText(body?.ageRange);

    if (!displayName) {
      throw new AccountRequestError("Please enter your full name.");
    }

    if (!phoneNumber) {
      throw new AccountRequestError("Please enter a phone number.");
    }

    if (!zipCode) {
      throw new AccountRequestError("Please enter a zip code.");
    }

    if (!isValidAgeRange(ageRange)) {
      throw new AccountRequestError("Please choose a valid age range.");
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(requestUser.uid);
    const existingSnapshot = await userRef.get();
    const existingProfile = existingSnapshot.exists ? existingSnapshot.data() || {} : {};
    const role = normalizeUserRole(existingProfile.role || requestUser.role);
    const email = requestUser.email || normalizeText(existingProfile.email);
    const profileRecord = {
      uid: requestUser.uid,
      email,
      role,
      displayName,
      phoneNumber,
      zipCode,
      ageRange,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!existingSnapshot.exists) {
      profileRecord.createdAt = FieldValue.serverTimestamp();
    }

    await userRef.set(profileRecord, { merge: true });
    await getAdminAuth().updateUser(requestUser.uid, { displayName });

    return NextResponse.json({
      profile: buildSerializedProfile({
        uid: requestUser.uid,
        email,
        role,
        displayName,
        phoneNumber,
        zipCode,
        ageRange,
      }),
    });
  } catch (error) {
    if (
      error instanceof AccountRequestError ||
      error instanceof FirebaseAuthenticationError
    ) {
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

    console.error("Unexpected account update error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while updating the account.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const userRef = getAdminDb().collection("users").doc(requestUser.uid);

    await deleteUserSubcollections(userRef);
    await userRef.delete();
    await deleteFirebaseAuthUser(requestUser.uid);

    return NextResponse.json({
      success: true,
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

    console.error("Unexpected account deletion error", error);

    return NextResponse.json(
      {
        error: "Unexpected error while deleting the account.",
      },
      { status: 500 }
    );
  }
}