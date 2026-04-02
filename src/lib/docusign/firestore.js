import "server-only";

import { getAdminDb, FieldValue } from "@/lib/firebase/admin";

function buildEnvelopePayload({
  envelopeId,
  agreementTitle,
  signerName,
  signerEmail,
  requestOrigin,
  returnUrl,
  docuSignSession,
  requestUser,
}) {
  return {
    envelopeId,
    provider: "docusign",
    agreementTitle,
    status: "recipient_view_created",
    requestOrigin,
    returnUrl,
    docusign: {
      accountId: docuSignSession.accountId,
      basePath: docuSignSession.basePath,
      environment: process.env.DOCUSIGN_ENVIRONMENT || "demo",
    },
    signer: {
      name: signerName,
      email: signerEmail,
    },
    requestedBy: {
      uid: requestUser.uid,
      email: requestUser.email || "",
      name: requestUser.name || "",
    },
    lastSessionEvent: "recipient_view_created",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    recipientViewCreatedAt: FieldValue.serverTimestamp(),
  };
}

function buildUserEnvelopePayload({
  envelopeId,
  agreementTitle,
  signerName,
  signerEmail,
  docuSignSession,
}) {
  return {
    envelopeId,
    provider: "docusign",
    agreementTitle,
    status: "recipient_view_created",
    signer: {
      name: signerName,
      email: signerEmail,
    },
    docusign: {
      accountId: docuSignSession.accountId,
      basePath: docuSignSession.basePath,
      environment: process.env.DOCUSIGN_ENVIRONMENT || "demo",
    },
    lastSessionEvent: "recipient_view_created",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    recipientViewCreatedAt: FieldValue.serverTimestamp(),
  };
}

function buildEventUpdatePayload(sessionEndType) {
  const payload = {
    status: sessionEndType,
    lastSessionEvent: sessionEndType,
    sessionEndedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (sessionEndType === "signing_complete") {
    payload.completedAt = FieldValue.serverTimestamp();
  }

  if (sessionEndType === "viewing_complete") {
    payload.viewedAt = FieldValue.serverTimestamp();
  }

  if (sessionEndType.includes("cancel") || sessionEndType.includes("declin")) {
    payload.cancelledAt = FieldValue.serverTimestamp();
  }

  return payload;
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

  return null;
}

function serializeEnvelope(docSnapshot) {
  const data = docSnapshot.data() || {};

  return {
    id: docSnapshot.id,
    envelopeId: data.envelopeId || docSnapshot.id,
    provider: data.provider || "docusign",
    agreementTitle: data.agreementTitle || "Untitled agreement",
    status: data.status || "unknown",
    lastSessionEvent: data.lastSessionEvent || data.status || "unknown",
    signer: data.signer || null,
    docusign: data.docusign || null,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    recipientViewCreatedAt: serializeTimestamp(data.recipientViewCreatedAt),
    sessionEndedAt: serializeTimestamp(data.sessionEndedAt),
    completedAt: serializeTimestamp(data.completedAt),
    viewedAt: serializeTimestamp(data.viewedAt),
    cancelledAt: serializeTimestamp(data.cancelledAt),
    isSigned: data.status === "signing_complete" || Boolean(data.completedAt),
  };
}

export async function storeDocuSignEnvelopeRecord({
  envelopeId,
  agreementTitle,
  signerName,
  signerEmail,
  requestOrigin,
  returnUrl,
  docuSignSession,
  requestUser,
}) {
  const db = getAdminDb();
  const batch = db.batch();
  const envelopeRef = db.collection("docusignEnvelopes").doc(envelopeId);
  const userEnvelopeRef = db
    .collection("users")
    .doc(requestUser.uid)
    .collection("docusignEnvelopes")
    .doc(envelopeId);

  batch.set(
    envelopeRef,
    buildEnvelopePayload({
      envelopeId,
      agreementTitle,
      signerName,
      signerEmail,
      requestOrigin,
      returnUrl,
      docuSignSession,
      requestUser,
    }),
    { merge: true }
  );
  batch.set(
    userEnvelopeRef,
    buildUserEnvelopePayload({
      envelopeId,
      agreementTitle,
      signerName,
      signerEmail,
      docuSignSession,
    }),
    { merge: true }
  );

  await batch.commit();
}

export async function storeDocuSignEnvelopeEvent({
  envelopeId,
  requestUser,
  sessionEndType,
}) {
  const db = getAdminDb();
  const batch = db.batch();
  const envelopeRef = db.collection("docusignEnvelopes").doc(envelopeId);
  const userEnvelopeRef = db
    .collection("users")
    .doc(requestUser.uid)
    .collection("docusignEnvelopes")
    .doc(envelopeId);
  const updatePayload = buildEventUpdatePayload(sessionEndType);

  batch.set(envelopeRef, updatePayload, { merge: true });
  batch.set(userEnvelopeRef, updatePayload, { merge: true });

  await batch.commit();
}

export async function listUserDocuSignEnvelopes({ uid, limit = 50 }) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("docusignEnvelopes")
    .orderBy("updatedAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map(serializeEnvelope);
}

export async function getUserDocuSignEnvelope({ uid, envelopeId }) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("docusignEnvelopes")
    .doc(envelopeId)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return serializeEnvelope(snapshot);
}
