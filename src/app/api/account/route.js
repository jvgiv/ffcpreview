import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import {
  FieldValue,
  FirebaseAdminConfigurationError,
  getAdminAuth,
  getAdminDb,
  getAdminStorageBucket,
} from "@/lib/firebase/admin";
import { isValidAgeRange } from "@/lib/firebase/profileOptions";
import {
  FirebaseAuthenticationError,
  requireVerifiedFirebaseUser,
} from "@/lib/firebase/serverAuth";
import { normalizeUserRole } from "@/lib/firebase/userRoles";

export const runtime = "nodejs";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PROFILE_IMAGE_DIMENSION = 4096;
const MAX_PROFILE_IMAGE_INPUT_PIXELS = 16 * 1024 * 1024;
const PROFILE_IMAGE_OUTPUT_DIMENSION = 1024;
const PROFILE_IMAGE_OUTPUT_TYPE = "image/webp";
const PRIVATE_PROFILE_IMAGE_URL = "/api/account";
const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const PROFILE_IMAGE_FORMAT_TYPES = new Map([
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["gif", "image/gif"],
]);

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

function buildSafeErrorLog(error) {
  if (!(error instanceof Error)) {
    return {
      errorName: typeof error,
      errorMessage: String(error),
    };
  }

  return {
    errorName: error.name,
    errorMessage: error.message,
    errorCode:
      typeof error.code === "string" || typeof error.code === "number"
        ? error.code
        : null,
    errorStack: error.stack,
  };
}

function isOwnedProfileImagePath(profileImagePath, uid) {
  return Boolean(profileImagePath) &&
    profileImagePath.startsWith(`profile-images/${uid}/`);
}

async function buildSanitizedProfileImage(image) {
  let sourceBuffer;
  let imagePipeline;
  let metadata;

  try {
    sourceBuffer = Buffer.from(await image.arrayBuffer());
    imagePipeline = sharp(sourceBuffer, {
      failOn: "error",
      limitInputPixels: MAX_PROFILE_IMAGE_INPUT_PIXELS,
      page: 0,
      pages: 1,
      sequentialRead: true,
    });
    metadata = await imagePipeline.metadata();
  } catch {
    throw new AccountRequestError(
      "The selected file is not a valid JPG, PNG, WebP, or GIF image."
    );
  }

  const detectedContentType = PROFILE_IMAGE_FORMAT_TYPES.get(metadata.format);

  if (!detectedContentType || detectedContentType !== image.type) {
    throw new AccountRequestError(
      "The selected file's contents do not match its image type."
    );
  }

  if (!metadata.width || !metadata.height) {
    throw new AccountRequestError("The selected image has invalid dimensions.");
  }

  if (
    metadata.width > MAX_PROFILE_IMAGE_DIMENSION ||
    metadata.height > MAX_PROFILE_IMAGE_DIMENSION
  ) {
    throw new AccountRequestError(
      `Profile images cannot exceed ${MAX_PROFILE_IMAGE_DIMENSION} by ${MAX_PROFILE_IMAGE_DIMENSION} pixels.`
    );
  }

  try {
    return await imagePipeline
      .rotate()
      .resize({
        width: PROFILE_IMAGE_OUTPUT_DIMENSION,
        height: PROFILE_IMAGE_OUTPUT_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toColorspace("srgb")
      .webp({
        quality: 82,
        alphaQuality: 85,
        effort: 4,
      })
      .toBuffer();
  } catch {
    throw new AccountRequestError(
      "The selected image could not be safely processed."
    );
  }
}

function buildSerializedProfile({
  uid,
  email,
  role,
  displayName,
  phoneNumber,
  zipCode,
  ageRange,
  doNotSendEmail,
  profileImageUrl,
}) {
  return {
    uid,
    email,
    role,
    displayName,
    phoneNumber,
    zipCode,
    ageRange,
    doNotSendEmail,
    profileImageUrl,
  };
}

function hasOwnField(record, fieldName) {
  return Object.prototype.hasOwnProperty.call(record || {}, fieldName);
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
    const profileFieldNames = ["displayName", "phoneNumber", "zipCode", "ageRange"];
    const hasProfileUpdate = profileFieldNames.some((fieldName) =>
      hasOwnField(body, fieldName)
    );
    const hasEmailPreferenceUpdate = hasOwnField(body, "doNotSendEmail");

    if (!hasProfileUpdate && !hasEmailPreferenceUpdate) {
      throw new AccountRequestError("No supported account changes were provided.");
    }

    if (
      hasEmailPreferenceUpdate &&
      typeof body.doNotSendEmail !== "boolean"
    ) {
      throw new AccountRequestError("Please provide a valid email preference.");
    }

    const displayName = normalizeText(body?.displayName);
    const phoneNumber = normalizeText(body?.phoneNumber);
    const zipCode = normalizeText(body?.zipCode);
    const ageRange = normalizeText(body?.ageRange);

    if (hasProfileUpdate) {
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
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(requestUser.uid);
    const existingSnapshot = await userRef.get();
    const existingProfile = existingSnapshot.exists ? existingSnapshot.data() || {} : {};
    const role = normalizeUserRole(existingProfile.role || requestUser.role);
    const email = requestUser.email || normalizeText(existingProfile.email);
    const resolvedDisplayName = hasProfileUpdate
      ? displayName
      : normalizeText(existingProfile.displayName) || requestUser.name;
    const resolvedPhoneNumber = hasProfileUpdate
      ? phoneNumber
      : normalizeText(existingProfile.phoneNumber);
    const resolvedZipCode = hasProfileUpdate
      ? zipCode
      : normalizeText(existingProfile.zipCode);
    const resolvedAgeRange = hasProfileUpdate
      ? ageRange
      : normalizeText(existingProfile.ageRange);
    const doNotSendEmail = hasEmailPreferenceUpdate
      ? body.doNotSendEmail
      : existingProfile.doNotSendEmail === true;
    const profileImageUrl = normalizeText(existingProfile.profileImageUrl);
    const profileRecord = {
      uid: requestUser.uid,
      email,
      role,
      ...(hasProfileUpdate
        ? {
            displayName: resolvedDisplayName,
            phoneNumber: resolvedPhoneNumber,
            zipCode: resolvedZipCode,
            ageRange: resolvedAgeRange,
          }
        : {}),
      ...(hasEmailPreferenceUpdate
        ? {
            doNotSendEmail,
            emailPreferenceUpdatedAt: FieldValue.serverTimestamp(),
          }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (!existingSnapshot.exists) {
      profileRecord.createdAt = FieldValue.serverTimestamp();
    }

    await userRef.set(profileRecord, { merge: true });

    if (hasProfileUpdate) {
      await getAdminAuth().updateUser(requestUser.uid, {
        displayName: resolvedDisplayName,
      });
    }

    return NextResponse.json({
      profile: buildSerializedProfile({
        uid: requestUser.uid,
        email,
        role,
        displayName: resolvedDisplayName,
        phoneNumber: resolvedPhoneNumber,
        zipCode: resolvedZipCode,
        ageRange: resolvedAgeRange,
        doNotSendEmail,
        profileImageUrl,
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

export async function POST(request) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  let uploadStage = "authenticate";
  let requestUserId = null;
  let inputContentType = null;
  let inputSize = null;
  let outputSize = null;

  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    requestUserId = requestUser.uid;
    uploadStage = "parse_form_data";
    let formData;

    try {
      formData = await request.formData();
    } catch {
      throw new AccountRequestError("Unable to read the profile image upload.");
    }

    uploadStage = "validate_file";
    const image = formData.get("profileImage");

    if (!image || typeof image.arrayBuffer !== "function") {
      throw new AccountRequestError("Please choose an image to upload.");
    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.has(image.type)) {
      throw new AccountRequestError("Choose a JPG, PNG, WebP, or GIF image.");
    }

    if (!image.size || image.size > MAX_PROFILE_IMAGE_SIZE) {
      throw new AccountRequestError("Profile images must be 5 MB or smaller.");
    }

    inputContentType = image.type;
    inputSize = image.size;
    uploadStage = "initialize_storage";
    const bucket = getAdminStorageBucket();
    const userRef = getAdminDb().collection("users").doc(requestUser.uid);
    uploadStage = "load_existing_profile";
    const existingUserSnapshot = await userRef.get();
    const previousProfileImagePath = normalizeText(
      existingUserSnapshot.data()?.profileImagePath
    );
    const profileImagePath = `profile-images/${requestUser.uid}/${randomUUID()}.webp`;
    const storageFile = bucket.file(profileImagePath);
    uploadStage = "sanitize_image";
    const imageBuffer = await buildSanitizedProfileImage(image);
    outputSize = imageBuffer.length;

    uploadStage = "save_to_storage";
    await storageFile.save(imageBuffer, {
      resumable: false,
      metadata: {
        contentType: PROFILE_IMAGE_OUTPUT_TYPE,
        cacheControl: "private, no-store",
      },
    });

    const profileImageUrl = PRIVATE_PROFILE_IMAGE_URL;

    uploadStage = "save_profile_record";
    try {
      await userRef.set(
        {
          uid: requestUser.uid,
          email: requestUser.email,
          profileImageUrl,
          profileImagePath,
          profileImageUpdatedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      try {
        await storageFile.delete();
      } catch (cleanupError) {
        console.error("Profile image rollback cleanup failed", {
          requestId,
          userId: requestUserId,
          stage: "rollback_new_storage_object",
          ...buildSafeErrorLog(cleanupError),
        });
      }

      throw error;
    }

    if (
      isOwnedProfileImagePath(previousProfileImagePath, requestUser.uid) &&
      previousProfileImagePath !== profileImagePath
    ) {
      uploadStage = "delete_previous_image";
      try {
        await bucket.file(previousProfileImagePath).delete();
      } catch (error) {
        if (error?.code !== 404) {
          console.error("Previous profile image cleanup failed", {
            requestId,
            userId: requestUserId,
            stage: uploadStage,
            ...buildSafeErrorLog(error),
          });
        }
      }
    }

    console.info("Profile image upload completed", {
      requestId,
      userId: requestUserId,
      inputContentType,
      inputSize,
      outputContentType: PROFILE_IMAGE_OUTPUT_TYPE,
      outputSize,
      elapsedMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      profileImageUrl,
      requestId,
    });
  } catch (error) {
    const logDetails = {
      requestId,
      userId: requestUserId,
      stage: uploadStage,
      inputContentType,
      inputSize,
      outputSize,
      elapsedMs: Date.now() - startedAt,
      ...buildSafeErrorLog(error),
    };

    if (
      error instanceof AccountRequestError ||
      error instanceof FirebaseAuthenticationError
    ) {
      console.warn("Profile image upload rejected", logDetails);

      return NextResponse.json(
        { error: error.message, requestId },
        { status: error.status }
      );
    }

    if (error instanceof FirebaseAdminConfigurationError) {
      console.error("Profile image upload configuration failed", logDetails);

      return NextResponse.json(
        {
          error: error.message,
          missing: error.missing,
          requestId,
        },
        { status: 500 }
      );
    }

    console.error("Unexpected profile image upload error", logDetails);

    return NextResponse.json(
      {
        error: "Unexpected error while uploading the profile image.",
        requestId,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const requestId = randomUUID();

  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const userSnapshot = await getAdminDb()
      .collection("users")
      .doc(requestUser.uid)
      .get();
    const profileImagePath = normalizeText(
      userSnapshot.data()?.profileImagePath
    );

    if (!isOwnedProfileImagePath(profileImagePath, requestUser.uid)) {
      return NextResponse.json(
        { error: "Profile image not found.", requestId },
        { status: 404 }
      );
    }

    const storageFile = getAdminStorageBucket().file(profileImagePath);
    const [metadata] = await storageFile.getMetadata();
    const contentType = normalizeText(metadata.contentType);
    const imageSize = Number(metadata.size || 0);

    if (!ALLOWED_PROFILE_IMAGE_TYPES.has(contentType) ||
        !imageSize ||
        imageSize > MAX_PROFILE_IMAGE_SIZE) {
      console.error("Stored profile image metadata is invalid", {
        requestId,
        userId: requestUser.uid,
        contentType,
        imageSize,
      });

      return NextResponse.json(
        { error: "Profile image is unavailable.", requestId },
        { status: 422 }
      );
    }

    const [imageBuffer] = await storageFile.download();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": "inline",
        "Content-Length": String(imageBuffer.length),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    if (error instanceof FirebaseAuthenticationError) {
      return NextResponse.json(
        { error: error.message, requestId },
        { status: error.status }
      );
    }

    if (error?.code === 404) {
      return NextResponse.json(
        { error: "Profile image not found.", requestId },
        { status: 404 }
      );
    }

    console.error("Unexpected authenticated profile image error", {
      requestId,
      ...buildSafeErrorLog(error),
    });

    return NextResponse.json(
      { error: "Unable to load the profile image.", requestId },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const requestUser = await requireVerifiedFirebaseUser(request);
    const userRef = getAdminDb().collection("users").doc(requestUser.uid);
    const userSnapshot = await userRef.get();
    const profileImagePath = normalizeText(userSnapshot.data()?.profileImagePath);

    if (isOwnedProfileImagePath(profileImagePath, requestUser.uid)) {
      try {
        await getAdminStorageBucket().file(profileImagePath).delete();
      } catch (error) {
        if (error?.code !== 404) {
          console.error("Profile image deletion failed", error);
        }
      }
    }

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
