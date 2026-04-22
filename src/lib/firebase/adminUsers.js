import "server-only";

import { getAdminDb } from "./admin";
import { formatUserRole, normalizeUserRole, USER_ROLES } from "./userRoles";
import { formatPaymentStatus, isPaymentComplete } from "@/lib/purchases";

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

function getSortTime(record) {
  return (
    Date.parse(record.updatedAt || "") ||
    Date.parse(record.createdAt || "") ||
    0
  );
}

function serializePaymentSummaryEntry(summary = {}) {
  return {
    agreementSlug: summary.agreementSlug || "",
    packageName: summary.packageName || "",
    agreementTitle: summary.agreementTitle || "",
    status: summary.status || "",
    statusLabel: formatPaymentStatus(summary.status || ""),
    paypalStatus: summary.paypalStatus || "",
    priceLabel: summary.priceLabel || "",
    amount: summary.amount || null,
    lastOrderId: summary.lastOrderId || "",
    lastEnvelopeId: summary.lastEnvelopeId || "",
    payerEmail: summary.payerEmail || "",
    completedAt: serializeTimestamp(summary.completedAt),
    updatedAt: serializeTimestamp(summary.updatedAt),
    isPaid: isPaymentComplete(summary.status),
  };
}

function serializePaymentSummary(paymentSummary = null) {
  if (!paymentSummary || typeof paymentSummary !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(paymentSummary).map(([agreementSlug, summary]) => [
      agreementSlug,
      serializePaymentSummaryEntry({
        agreementSlug,
        ...(summary || {}),
      }),
    ])
  );
}

function serializeUser(docSnapshot) {
  const data = docSnapshot.data() || {};
  const role = normalizeUserRole(data.role);

  return {
    id: docSnapshot.id,
    uid: data.uid || docSnapshot.id,
    displayName: data.displayName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    zipCode: data.zipCode || "",
    ageRange: data.ageRange || "",
    role,
    roleLabel: formatUserRole(role),
    paymentSummary: serializePaymentSummary(data.paymentSummary),
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
  };
}

export async function listAllUsersSummary({ limit = 250 } = {}) {
  const snapshot = await getAdminDb().collection("users").get();

  return snapshot.docs
    .map(serializeUser)
    .sort((left, right) => getSortTime(right) - getSortTime(left))
    .slice(0, limit);
}

export function buildUserMetrics(users) {
  const adminCount = users.filter((user) => user.role === USER_ROLES.ADMIN).length;
  const clientCount = users.filter((user) => user.role === USER_ROLES.CLIENT).length;
  const paidPackageCount = users.reduce(
    (count, user) =>
      count +
      Object.values(user.paymentSummary || {}).filter((summary) => summary.isPaid).length,
    0
  );

  return {
    totalUsers: users.length,
    adminCount,
    clientCount,
    paidPackageCount,
  };
}
