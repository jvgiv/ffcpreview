import "server-only";

import crypto from "node:crypto";
import { buildDocuSignConsentUrl, getDocuSignConfig } from "./config";
import {
  DocuSignApiError,
  DocuSignConsentRequiredError,
} from "./errors";

let cachedSession = null;

function encodeBase64Url(value) {
  const input = typeof value === "string" ? value : JSON.stringify(value);
  return Buffer.from(input).toString("base64url");
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

function createJwtAssertion(config) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const payload = {
    iss: config.integrationKey,
    sub: config.userId,
    aud: config.authServer,
    iat: nowInSeconds,
    exp: nowInSeconds + 60 * 10,
    scope: "signature impersonation",
  };

  const encodedHeader = encodeBase64Url(header);
  const encodedPayload = encodeBase64Url(payload);
  const body = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(body), config.privateKey);

  return `${body}.${signature.toString("base64url")}`;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  const data = parseJsonText(text);

  return { response, data };
}

function readAccountId(account) {
  return account?.account_id || account?.accountId || "";
}

function readBaseUri(account) {
  return account?.base_uri || account?.baseUri || "";
}

function readIsDefault(account) {
  return account?.is_default ?? account?.isDefault;
}

function resolveAccount(userInfo, preferredAccountId) {
  const accounts = Array.isArray(userInfo?.accounts) ? userInfo.accounts : [];

  if (!accounts.length) {
    throw new DocuSignApiError(
      "DocuSign user info did not return any available accounts.",
      { status: 502, details: userInfo }
    );
  }

  if (preferredAccountId) {
    const matchingAccount = accounts.find(
      (account) => readAccountId(account) === preferredAccountId
    );

    if (!matchingAccount) {
      throw new DocuSignApiError(
        `The configured DocuSign account (${preferredAccountId}) was not found for the impersonated user.`,
        { status: 500, details: userInfo }
      );
    }

    return matchingAccount;
  }

  return (
    accounts.find(
      (account) => readIsDefault(account) === true || readIsDefault(account) === "true"
    ) || accounts[0]
  );
}

async function requestAccessToken(config) {
  const assertion = createJwtAssertion(config);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const { response, data } = await fetchJson(
    `https://${config.authServer}/oauth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (data?.error === "consent_required") {
      throw new DocuSignConsentRequiredError(buildDocuSignConsentUrl());
    }

    throw new DocuSignApiError(
      data?.error_description || data?.error || "DocuSign token request failed.",
      {
        status: response.status,
        details: data,
      }
    );
  }

  return data;
}

async function requestUserInfo(accessToken, authServer) {
  const { response, data } = await fetchJson(
    `https://${authServer}/oauth/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new DocuSignApiError("Unable to load DocuSign user info.", {
      status: response.status,
      details: data,
    });
  }

  return data;
}

export async function getDocuSignSession() {
  if (cachedSession && cachedSession.expiresAt > Date.now() + 60_000) {
    return cachedSession;
  }

  const config = getDocuSignConfig();
  const tokenData = await requestAccessToken(config);
  const userInfo = await requestUserInfo(tokenData.access_token, config.authServer);
  const account = resolveAccount(userInfo, config.accountId);
  const accountId = readAccountId(account);
  const baseUri = readBaseUri(account);

  if (!accountId || !baseUri) {
    throw new DocuSignApiError(
      "DocuSign user info did not include the account ID or base URI.",
      {
        status: 502,
        details: userInfo,
      }
    );
  }

  cachedSession = {
    accessToken: tokenData.access_token,
    accountId,
    basePath: `${baseUri}/restapi`,
    expiresAt: Date.now() + (tokenData.expires_in || 3600) * 1000,
  };

  return cachedSession;
}
