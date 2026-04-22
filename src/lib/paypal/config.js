import "server-only";

export class PayPalConfigurationError extends Error {
  constructor(message, missing = []) {
    super(message);
    this.name = "PayPalConfigurationError";
    this.missing = missing;
  }
}

const PAYPAL_ENVIRONMENTS = {
  sandbox: {
    apiBaseUrl: "https://api-m.sandbox.paypal.com",
  },
  live: {
    apiBaseUrl: "https://api-m.paypal.com",
  },
};

function normalizeEnvironmentName(value) {
  if (!value) {
    return "sandbox";
  }

  const normalized = value.toLowerCase();
  return PAYPAL_ENVIRONMENTS[normalized] ? normalized : null;
}

export function getPayPalConfig() {
  const environment = normalizeEnvironmentName(process.env.PAYPAL_ENVIRONMENT);

  if (!environment) {
    throw new PayPalConfigurationError(
      "PAYPAL_ENVIRONMENT must be either 'sandbox' or 'live'.",
      ["PAYPAL_ENVIRONMENT"]
    );
  }

  const publicClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim() || "";
  const missing = [
    !publicClientId && "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    !clientSecret && "PAYPAL_CLIENT_SECRET",
  ].filter(Boolean);

  if (missing.length) {
    throw new PayPalConfigurationError(
      "PayPal is missing required environment variables.",
      missing
    );
  }

  return {
    environment,
    publicClientId,
    clientSecret,
    apiBaseUrl: PAYPAL_ENVIRONMENTS[environment].apiBaseUrl,
  };
}

export function getPayPalConfigStatus() {
  try {
    const config = getPayPalConfig();

    return {
      ready: true,
      environment: config.environment,
      publicClientId: config.publicClientId,
    };
  } catch (error) {
    if (error instanceof PayPalConfigurationError) {
      return {
        ready: false,
        missing: error.missing,
        message: error.message,
      };
    }

    throw error;
  }
}
