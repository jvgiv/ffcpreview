import "server-only";

import { getPayPalConfig } from "./config";

export class PayPalApiError extends Error {
  constructor(message, { status = 500, details = null } = {}) {
    super(message);
    this.name = "PayPalApiError";
    this.status = status;
    this.details = details;
  }
}

function parseJsonText(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function buildBasicAuthHeader(clientId, clientSecret) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function readPayPalResponse(response) {
  const text = await response.text();
  const data = parseJsonText(text);

  if (!response.ok) {
    throw new PayPalApiError(data?.message || "A PayPal API request failed.", {
      status: response.status,
      details: data,
    });
  }

  return data;
}

export async function getPayPalAccessToken() {
  const config = getPayPalConfig();
  const response = await fetch(`${config.apiBaseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      Authorization: buildBasicAuthHeader(config.publicClientId, config.clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const data = await readPayPalResponse(response);

  if (!data?.access_token) {
    throw new PayPalApiError("PayPal did not return an access token.", {
      status: 502,
      details: data,
    });
  }

  return data.access_token;
}

async function callPayPalApi(pathname, { method = "GET", body = null } = {}) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${config.apiBaseUrl}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
    cache: "no-store",
  });

  return readPayPalResponse(response);
}

function buildCustomId({ requestUser, purchase, envelopeId }) {
  return [requestUser.uid, purchase.agreementSlug, envelopeId || "no-envelope"].join(":");
}

export async function createPayPalOrder({ purchase, requestUser, envelopeId }) {
  return callPayPalApi("/v2/checkout/orders", {
    method: "POST",
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: purchase.agreementSlug,
          custom_id: buildCustomId({
            requestUser,
            purchase,
            envelopeId,
          }),
          description: purchase.description,
          amount: {
            currency_code: purchase.amount.currencyCode,
            value: purchase.amount.value,
          },
        },
      ],
    },
  });
}

export async function capturePayPalOrder(orderId) {
  return callPayPalApi(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    body: {},
  });
}
