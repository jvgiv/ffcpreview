import { getAgreementBySlug } from "./agreements";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const MAX_ADDITIONAL_ORIENTEERS = 4;

export const DISCOUNT_CODE_DEFINITIONS = {
  DOGSTARFFC100: {
    code: "DogstarFFC100",
    normalizedCode: "DOGSTARFFC100",
    percentOff: 100,
    label: "DogstarFFC100 discount",
  },
  DOGSTARFFC50: {
    code: "DogstarFFC50",
    normalizedCode: "DOGSTARFFC50",
    percentOff: 50,
    label: "DogstarFFC50 discount",
  },
};

const ADDITIONAL_PLAN_DEFINITIONS = {
  none: {
    tier: "none",
    displayName: "No Additional Orienteers",
    shortLabel: "None",
    amountInCents: 0,
  },
  basic: {
    tier: "basic",
    displayName: "Additional Basic Financial Orientation Package",
    shortLabel: "Basic Add-On",
    amountInCents: 25000,
  },
  premium: {
    tier: "premium",
    displayName: "Additional Premium Financial Orientation Package",
    shortLabel: "Premium Add-On",
    amountInCents: 37500,
  },
};

function formatAdditionalSummary(additionalPlan, additionalCount) {
  if (!additionalPlan || additionalPlan.tier === "none" || additionalCount <= 0) {
    return "";
  }

  return `${additionalCount} ${additionalPlan.displayName}${
    additionalCount === 1 ? "" : "s"
  }`;
}

function formatPricingBreakdown(basePurchase, additionalPlan, additionalCount) {
  if (!basePurchase) {
    return "";
  }

  if (!additionalPlan || additionalPlan.tier === "none" || additionalCount <= 0) {
    return basePurchase.priceLabel;
  }

  return `${basePurchase.priceLabel} + ${formatUsdFromCents(
    additionalPlan.amountInCents
  )} per ${additionalPlan.shortLabel.toLowerCase()}`;
}

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

export function formatUsdFromCents(valueInCents) {
  return USD_FORMATTER.format(valueInCents / 100);
}

function buildAmount(valueInCents) {
  return {
    currencyCode: "USD",
    value: (valueInCents / 100).toFixed(2),
    valueInCents,
  };
}

function getAmountValueInCents(amount) {
  if (typeof amount?.valueInCents === "number") {
    return amount.valueInCents;
  }

  const parsedAmount = Number.parseFloat(amount?.value || "0");

  return Number.isNaN(parsedAmount) ? 0 : Math.round(parsedAmount * 100);
}

export function normalizeDiscountCode(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

export function getDiscountByCode(value) {
  const normalizedCode = normalizeDiscountCode(value);

  return DISCOUNT_CODE_DEFINITIONS[normalizedCode] || null;
}

export function applyDiscountToPurchase(purchase, discountCode) {
  if (!purchase) {
    return null;
  }

  const discount = getDiscountByCode(discountCode);

  if (!discount) {
    return purchase;
  }

  const originalValueInCents = getAmountValueInCents(purchase.amount);
  const discountValueInCents = Math.min(
    originalValueInCents,
    Math.round((originalValueInCents * discount.percentOff) / 100)
  );
  const discountedValueInCents = Math.max(
    0,
    originalValueInCents - discountValueInCents
  );
  const originalAmount = purchase.originalAmount || buildAmount(originalValueInCents);
  const discountAmount = buildAmount(discountValueInCents);
  const discountSummary = `${discount.code} ${discount.percentOff}% discount`;

  return {
    ...purchase,
    amount: buildAmount(discountedValueInCents),
    originalAmount,
    priceLabel: formatUsdFromCents(discountedValueInCents),
    pricingBreakdown: `${
      purchase.pricingBreakdown || purchase.priceLabel
    } - ${discountSummary} (-${formatUsdFromCents(discountValueInCents)})`,
    discount: {
      code: discount.code,
      percentOff: discount.percentOff,
      label: discount.label,
      amount: discountAmount,
    },
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

  return Math.min(normalizedValue, MAX_ADDITIONAL_ORIENTEERS);
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
  const additionalSummary = formatAdditionalSummary(additionalPlan, effectiveAdditionalCount);

  return {
    ...basePurchase,
    basePlanTier: basePurchase.planTier,
    additionalPlanTier: additionalPlan.tier,
    additionalCount: effectiveAdditionalCount,
    amount,
    priceLabel: formatUsdFromCents(totalValueInCents),
    pricingBreakdown: formatPricingBreakdown(
      basePurchase,
      additionalPlan,
      effectiveAdditionalCount
    ),
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

  const amount = {
    currencyCode: record.amount.currencyCode || "USD",
    value: record.amount.value,
    valueInCents: getAmountValueInCents(record.amount),
  };
  const originalAmount = record.originalAmount
    ? {
        currencyCode: record.originalAmount.currencyCode || "USD",
        value: record.originalAmount.value,
        valueInCents: getAmountValueInCents(record.originalAmount),
      }
    : null;

  return {
    agreementSlug: record.agreementSlug,
    agreementTitle: record.agreementTitle || "",
    agreementPackageName: record.packageName || "",
    displayName: record.packageName || "Far Flung Change Package",
    shortLabel: record.packageName || "Far Flung Change Package",
    priceLabel: record.priceLabel || "",
    amount,
    ...(originalAmount ? { originalAmount } : {}),
    ...(record.pricingBreakdown ? { pricingBreakdown: record.pricingBreakdown } : {}),
    ...(record.discount ? { discount: record.discount } : {}),
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
