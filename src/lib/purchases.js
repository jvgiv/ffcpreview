import { getAgreementBySlug } from "./agreements";

export const PURCHASE_DEFINITIONS = {
  "financial-orientation": {
    agreementSlug: "financial-orientation",
    displayName: "Financial Services",
    shortLabel: "Financial Services",
    priceLabel: "$500",
    amount: {
      currencyCode: "USD",
      value: "500.00",
      valueInCents: 50000,
    },
    description:
      "Far Flung Change's core educational financial services engagement for one year.",
    successTitle: "Financial Services Payment Complete",
  },
  "premium-expansion-pack": {
    agreementSlug: "premium-expansion-pack",
    displayName: "Premium Expansion Pack",
    shortLabel: "Premium Expansion Pack",
    priceLabel: "$750",
    amount: {
      currencyCode: "USD",
      value: "750.00",
      valueInCents: 75000,
    },
    description:
      "Far Flung Change's premium expansion engagement with additional structure and accountability support.",
    successTitle: "Premium Expansion Pack Payment Complete",
  },
};

function buildResolvedPurchase(purchase) {
  if (!purchase) {
    return null;
  }

  const agreement = getAgreementBySlug(purchase.agreementSlug);

  if (!agreement) {
    return null;
  }

  return {
    ...purchase,
    agreementSlug: agreement.slug,
    agreementTitle: agreement.agreementTitle,
    agreementPackageName: agreement.packageName,
  };
}

export function getPurchaseBySlug(slug) {
  if (!slug) {
    return null;
  }

  return buildResolvedPurchase(PURCHASE_DEFINITIONS[slug] || null);
}

export function listPurchases() {
  return Object.values(PURCHASE_DEFINITIONS)
    .map(buildResolvedPurchase)
    .filter(Boolean);
}

export function isPaymentComplete(status) {
  return status === "paid";
}

export function formatPaymentStatus(status) {
  switch (status) {
    case "paid":
      return "Paid";
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    case "failed":
      return "Failed";
    default:
      return status ? status.replace(/[-_]/g, " ") : "Not started";
  }
}
