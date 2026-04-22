import "server-only";

import { FieldValue, getAdminDb } from "@/lib/firebase/admin";
import { getPayPalConfig } from "./config";

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

function serializePaymentSummary(summary = null) {
  if (!summary) {
    return null;
  }

  return {
    agreementSlug: summary.agreementSlug || "",
    packageName: summary.packageName || "",
    agreementTitle: summary.agreementTitle || "",
    provider: summary.provider || "paypal",
    status: summary.status || "",
    paypalStatus: summary.paypalStatus || "",
    priceLabel: summary.priceLabel || "",
    amount: summary.amount || null,
    lastOrderId: summary.lastOrderId || "",
    lastEnvelopeId: summary.lastEnvelopeId || "",
    captureId: summary.captureId || "",
    payerEmail: summary.payerEmail || "",
    agreementSigned: Boolean(summary.agreementSigned),
    lastAction: summary.lastAction || "",
    createdAt: serializeTimestamp(summary.createdAt),
    updatedAt: serializeTimestamp(summary.updatedAt),
    completedAt: serializeTimestamp(summary.completedAt),
  };
}

function normalizePayPalPaymentStatus(paypalStatus) {
  switch (paypalStatus) {
    case "COMPLETED":
      return "paid";
    case "APPROVED":
      return "approved";
    case "CREATED":
    case "PAYER_ACTION_REQUIRED":
      return "pending";
    case "VOIDED":
      return "cancelled";
    default:
      return paypalStatus ? paypalStatus.toLowerCase() : "pending";
  }
}

function getApprovalUrl(order) {
  const links = Array.isArray(order?.links) ? order.links : [];
  const approveLink = links.find((link) => link.rel === "approve");
  return approveLink?.href || "";
}

function extractPayerEmail(order) {
  return (
    order?.payer?.email_address ||
    order?.payment_source?.paypal?.email_address ||
    ""
  );
}

function extractCaptureId(order) {
  return (
    order?.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
    ""
  );
}

function buildOrderPayload({ order, purchase, requestUser, envelopeId }) {
  const environment = getPayPalConfig().environment;

  return {
    orderId: order.id,
    provider: "paypal",
    environment,
    agreementSlug: purchase.agreementSlug,
    packageName: purchase.displayName,
    agreementTitle: purchase.agreementTitle,
    priceLabel: purchase.priceLabel,
    amount: {
      value: purchase.amount.value,
      currencyCode: purchase.amount.currencyCode,
    },
    paymentStatus: normalizePayPalPaymentStatus(order.status),
    paypalStatus: order.status || "CREATED",
    approvalUrl: getApprovalUrl(order),
    envelopeId: envelopeId || "",
    payerEmail: extractPayerEmail(order),
    captureId: extractCaptureId(order),
    requestedBy: {
      uid: requestUser.uid,
      email: requestUser.email || "",
      name: requestUser.name || "",
      role: requestUser.role || "client",
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    orderCreatedAt: FieldValue.serverTimestamp(),
  };
}

function buildSummaryPayload({ order, purchase, envelopeId, existingSummary = null }) {
  const paymentStatus = normalizePayPalPaymentStatus(order.status);
  const summary = {
    agreementSlug: purchase.agreementSlug,
    packageName: purchase.displayName,
    agreementTitle: purchase.agreementTitle,
    provider: "paypal",
    status: paymentStatus,
    paypalStatus: order.status || "CREATED",
    priceLabel: purchase.priceLabel,
    amount: {
      value: purchase.amount.value,
      currencyCode: purchase.amount.currencyCode,
    },
    lastOrderId: order.id || existingSummary?.lastOrderId || "",
    lastEnvelopeId: envelopeId || existingSummary?.lastEnvelopeId || "",
    captureId: extractCaptureId(order) || existingSummary?.captureId || "",
    payerEmail: extractPayerEmail(order) || existingSummary?.payerEmail || "",
    agreementSigned:
      typeof existingSummary?.agreementSigned === "boolean"
        ? existingSummary.agreementSigned || Boolean(envelopeId)
        : Boolean(envelopeId),
    lastAction: paymentStatus === "paid" ? "order_captured" : "order_created",
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!existingSummary) {
    summary.createdAt = FieldValue.serverTimestamp();
  }

  if (paymentStatus === "paid") {
    summary.completedAt = FieldValue.serverTimestamp();
  }

  return summary;
}

function serializeOrder(docSnapshot) {
  const data = docSnapshot.data() || {};

  return {
    id: docSnapshot.id,
    orderId: data.orderId || docSnapshot.id,
    provider: data.provider || "paypal",
    environment: data.environment || "",
    agreementSlug: data.agreementSlug || "",
    packageName: data.packageName || "",
    agreementTitle: data.agreementTitle || "",
    priceLabel: data.priceLabel || "",
    amount: data.amount || null,
    paymentStatus: data.paymentStatus || "",
    paypalStatus: data.paypalStatus || "",
    approvalUrl: data.approvalUrl || "",
    envelopeId: data.envelopeId || "",
    payerEmail: data.payerEmail || "",
    captureId: data.captureId || "",
    requestedBy: data.requestedBy || null,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    orderCreatedAt: serializeTimestamp(data.orderCreatedAt),
  };
}

export async function storePayPalOrderRecord({
  order,
  purchase,
  requestUser,
  envelopeId,
}) {
  const db = getAdminDb();
  const batch = db.batch();
  const orderRef = db.collection("paypalOrders").doc(order.id);
  const userOrderRef = db
    .collection("users")
    .doc(requestUser.uid)
    .collection("paypalOrders")
    .doc(order.id);
  const userRef = db.collection("users").doc(requestUser.uid);
  const userSnapshot = await userRef.get();
  const existingSummary =
    userSnapshot.data()?.paymentSummary?.[purchase.agreementSlug] || null;
  const orderPayload = buildOrderPayload({
    order,
    purchase,
    requestUser,
    envelopeId,
  });
  const summaryPayload = buildSummaryPayload({
    order,
    purchase,
    envelopeId,
    existingSummary,
  });

  batch.set(orderRef, orderPayload, { merge: true });
  batch.set(userOrderRef, orderPayload, { merge: true });
  batch.set(
    userRef,
    {
      paymentSummary: {
        [purchase.agreementSlug]: summaryPayload,
      },
    },
    { merge: true }
  );

  await batch.commit();
}

export async function storeCapturedPayPalOrder({
  order,
  existingOrder,
  purchase,
  requestUser,
}) {
  const db = getAdminDb();
  const batch = db.batch();
  const orderRef = db.collection("paypalOrders").doc(order.id);
  const userOrderRef = db
    .collection("users")
    .doc(requestUser.uid)
    .collection("paypalOrders")
    .doc(order.id);
  const userRef = db.collection("users").doc(requestUser.uid);
  const userSnapshot = await userRef.get();
  const existingSummary =
    userSnapshot.data()?.paymentSummary?.[purchase.agreementSlug] || null;
  const envelopeId = existingOrder?.envelopeId || existingSummary?.lastEnvelopeId || "";
  const orderPayload = {
    paymentStatus: normalizePayPalPaymentStatus(order.status),
    paypalStatus: order.status || "COMPLETED",
    payerEmail: extractPayerEmail(order),
    captureId: extractCaptureId(order),
    updatedAt: FieldValue.serverTimestamp(),
    completedAt: FieldValue.serverTimestamp(),
  };
  const summaryPayload = buildSummaryPayload({
    order,
    purchase,
    envelopeId,
    existingSummary,
  });

  batch.set(orderRef, orderPayload, { merge: true });
  batch.set(userOrderRef, orderPayload, { merge: true });
  batch.set(
    userRef,
    {
      paymentSummary: {
        [purchase.agreementSlug]: summaryPayload,
      },
    },
    { merge: true }
  );

  await batch.commit();
}

export async function getUserPayPalOrder({ uid, orderId }) {
  const snapshot = await getAdminDb()
    .collection("users")
    .doc(uid)
    .collection("paypalOrders")
    .doc(orderId)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return serializeOrder(snapshot);
}

export async function getUserPaymentSummary({ uid, agreementSlug }) {
  const snapshot = await getAdminDb().collection("users").doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  return serializePaymentSummary(snapshot.data()?.paymentSummary?.[agreementSlug] || null);
}
