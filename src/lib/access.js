import { isPaymentComplete } from "./purchases";
import { normalizeUserRole, USER_ROLES } from "./firebase/userRoles";

export const DEFINITIONS_ACCESS_PURCHASE_SLUGS = [
  "financial-orientation",
  "premium-expansion-pack",
];

export function hasPaidAccessForPurchases(paymentSummary = {}, purchaseSlugs = []) {
  if (!paymentSummary || typeof paymentSummary !== "object") {
    return false;
  }

  return purchaseSlugs.some((purchaseSlug) =>
    isPaymentComplete(paymentSummary?.[purchaseSlug]?.status)
  );
}

export function hasDefinitionsAccess({ role, paymentSummary } = {}) {
  if (normalizeUserRole(role) === USER_ROLES.ADMIN) {
    return true;
  }

  return hasPaidAccessForPurchases(paymentSummary, DEFINITIONS_ACCESS_PURCHASE_SLUGS);
}
