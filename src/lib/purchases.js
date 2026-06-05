import { getAgreementBySlug } from "./agreements";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ADDITIONAL_PLAN_DEFINITIONS = {
  none: {
    tier: "none",
    displayName: "No Additional Orienteers",
    shortLabel: "None",
    amountInCents: 0,
  },
  basic: {
    tier: "basic",
    displayName: "Additional Basic FOP",
    shortLabel: "Basic Add-On",
    amountInCents: 25000,
  },
  premium: {
    tier: "premium",
    displayName: "Additional Premium FOP",
    shortLabel: "Premium Add-On",
    amountInCents: 37500,
  },
};

export const PURCHASE_DEFINITIONS = {
  "financial-orientation": {
    agreementSlug: "financial-orientation",
    displayName: "Financial Services",
    shortLabel: "Financial Services",
    planTier: "basic",
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
    planTier: "premium",
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

function formatUsdFromCents(valueInCents) {
  return USD_FORMATTER.format(valueInCents / 100);
}

function buildAmount(valueInCents) {
  return {
    currencyCode: "USD",
    value: (valueInCents / 100).toFixed(2),
    valueInCents,
  };
}

export function normalizeAdditionalPlanTier(value) {
  const normalizedValue =
    typeof value === "string" ? value.trim().toLowerCase() : "";

  return ADDITIONAL_PLAN_DEFINITIONS[normalizedValue]
    ? normalizedValue
    : "none";
}

export function normalizeAdditionalOrienteerCount(value) {
  const normalizedValue = Number.parseInt(String(value ?? "").trim(), 10);

  if (Number.isNaN(normalizedValue) || normalizedValue < 0) {
    return 0;
  }

  return Math.min(normalizedValue, 9);
}

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

export function buildCheckoutPurchase({
  agreementSlug,
  additionalPlanTier = "none",
  additionalCount = 0,
}) {
  const basePurchase = getPurchaseBySlug(agreementSlug);

  if (!basePurchase) {
    return null;
  }

  const resolvedAdditionalPlanTier = normalizeAdditionalPlanTier(additionalPlanTier);
  const resolvedAdditionalCount = normalizeAdditionalOrienteerCount(additionalCount);
  const additionalPlan =
    resolvedAdditionalCount > 0
      ? ADDITIONAL_PLAN_DEFINITIONS[resolvedAdditionalPlanTier]
      : ADDITIONAL_PLAN_DEFINITIONS.none;
  const effectiveAdditionalCount =
    additionalPlan.tier === "none" ? 0 : resolvedAdditionalCount;
  const totalValueInCents =
    basePurchase.amount.valueInCents +
    additionalPlan.amountInCents * effectiveAdditionalCount;
  const amount = buildAmount(totalValueInCents);
  const additionalSummary =
    effectiveAdditionalCount > 0
      ? `${effectiveAdditionalCount} ${additionalPlan.displayName}${
          effectiveAdditionalCount === 1 ? "" : "s"
        }`
      : "";

  return {
    ...basePurchase,
    basePlanTier: basePurchase.planTier,
    additionalPlanTier: additionalPlan.tier,
    additionalCount: effectiveAdditionalCount,
    amount,
    priceLabel: formatUsdFromCents(totalValueInCents),
    pricingBreakdown:
      effectiveAdditionalCount > 0
        ? `${basePurchase.priceLabel} + ${effectiveAdditionalCount} x ${formatUsdFromCents(
            additionalPlan.amountInCents
          )}`
        : basePurchase.priceLabel,
    displayName: additionalSummary
      ? `${basePurchase.displayName} + ${additionalSummary}`
      : basePurchase.displayName,
    shortLabel: additionalSummary
      ? `${basePurchase.shortLabel} + ${effectiveAdditionalCount} add-on${
          effectiveAdditionalCount === 1 ? "" : "s"
        }`
      : basePurchase.shortLabel,
    description: additionalSummary
      ? `${basePurchase.description} Includes ${additionalSummary.toLowerCase()}.`
      : basePurchase.description,
  };
}

export function buildPurchaseFromStoredRecord(record) {
  if (!record?.agreementSlug || !record?.amount?.value) {
    return null;
  }

  return {
    agreementSlug: record.agreementSlug,
    agreementTitle: record.agreementTitle || "",
    agreementPackageName: record.packageName || "",
    displayName: record.packageName || "Far Flung Change Package",
    shortLabel: record.packageName || "Far Flung Change Package",
    priceLabel: record.priceLabel || "",
    amount: {
      currencyCode: record.amount.currencyCode || "USD",
      value: record.amount.value,
      valueInCents:
        typeof record.amount.valueInCents === "number"
          ? record.amount.valueInCents
          : Math.round(Number.parseFloat(record.amount.value || "0") * 100),
    },
    description: record.packageName || "Far Flung Change checkout package",
    successTitle: "Checkout Complete",
  };
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
