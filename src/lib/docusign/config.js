import "server-only";

import fs from "node:fs";
import path from "node:path";
import { DocuSignConfigurationError } from "./errors";

const DOCUSIGN_ENVIRONMENTS = {
  demo: {
    authServer: "account-d.docusign.com",
    appsOrigin: "https://apps-d.docusign.com",
    jsBundleUrl: "https://js-d.docusign.com/bundle.js",
  },
  production: {
    authServer: "account.docusign.com",
    appsOrigin: "https://apps.docusign.com",
    jsBundleUrl: "https://js.docusign.com/bundle.js",
  },
};

function normalizeEnvironmentName(value) {
  if (!value) {
    return "demo";
  }

  const normalized = value.toLowerCase();
  return DOCUSIGN_ENVIRONMENTS[normalized] ? normalized : null;
}

function parseOriginList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => new URL(entry).origin);
}

function normalizePem(pem) {
  if (!pem) {
    return "";
  }

  return pem.replace(/\\n/g, "\n").trim();
}

function readPrivateKey() {
  const keyPath = process.env.DOCUSIGN_PRIVATE_KEY_PATH?.trim();
  const rawEnvKey = process.env.DOCUSIGN_PRIVATE_KEY?.trim();
  const base64EnvKey = process.env.DOCUSIGN_PRIVATE_KEY_BASE64?.trim();

  if (keyPath) {
    const resolvedPath = path.isAbsolute(keyPath)
      ? keyPath
      : path.resolve(process.cwd(), keyPath);

    return fs.readFileSync(resolvedPath, "utf8").trim();
  }

  if (rawEnvKey) {
    return normalizePem(rawEnvKey);
  }

  if (base64EnvKey) {
    return Buffer.from(base64EnvKey, "base64").toString("utf8").trim();
  }

  return "";
}

export function getDocuSignConfig() {
  const environment = normalizeEnvironmentName(process.env.DOCUSIGN_ENVIRONMENT);

  if (!environment) {
    throw new DocuSignConfigurationError(
      "DOCUSIGN_ENVIRONMENT must be either 'demo' or 'production'.",
      ["DOCUSIGN_ENVIRONMENT"]
    );
  }

  const privateKey = readPrivateKey();
  const missing = [
    !process.env.DOCUSIGN_INTEGRATION_KEY?.trim() && "DOCUSIGN_INTEGRATION_KEY",
    !process.env.DOCUSIGN_USER_ID?.trim() && "DOCUSIGN_USER_ID",
    !process.env.DOCUSIGN_CONSENT_REDIRECT_URI?.trim() &&
      "DOCUSIGN_CONSENT_REDIRECT_URI",
    !privateKey &&
      "DOCUSIGN_PRIVATE_KEY_PATH or DOCUSIGN_PRIVATE_KEY or DOCUSIGN_PRIVATE_KEY_BASE64",
  ].filter(Boolean);

  if (missing.length) {
    throw new DocuSignConfigurationError(
      "DocuSign is missing required environment variables.",
      missing
    );
  }

  const envConfig = DOCUSIGN_ENVIRONMENTS[environment];

  return {
    environment,
    authServer: process.env.DOCUSIGN_AUTH_SERVER?.trim() || envConfig.authServer,
    appsOrigin: envConfig.appsOrigin,
    jsBundleUrl: envConfig.jsBundleUrl,
    integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY.trim(),
    userId: process.env.DOCUSIGN_USER_ID.trim(),
    accountId: process.env.DOCUSIGN_ACCOUNT_ID?.trim() || null,
    consentRedirectUri: process.env.DOCUSIGN_CONSENT_REDIRECT_URI.trim(),
    signingReturnUrl: process.env.DOCUSIGN_SIGNING_RETURN_URL?.trim() || null,
    privateKey,
    allowedOrigins: parseOriginList(process.env.DOCUSIGN_ALLOWED_ORIGINS),
    defaultSignerName: process.env.DOCUSIGN_TEST_SIGNER_NAME?.trim() || "",
    defaultSignerEmail: process.env.DOCUSIGN_TEST_SIGNER_EMAIL?.trim() || "",
  };
}

export function getDocuSignConfigStatus() {
  try {
    const config = getDocuSignConfig();

    return {
      ready: true,
      environment: config.environment,
      accountIdConfigured: Boolean(config.accountId),
      consentRedirectUri: config.consentRedirectUri,
      signingReturnUrl: config.signingReturnUrl,
      publicIntegrationKey: config.integrationKey,
      jsBundleUrl: config.jsBundleUrl,
      defaultSignerName: config.defaultSignerName,
      defaultSignerEmail: config.defaultSignerEmail,
      allowedOrigins: config.allowedOrigins,
    };
  } catch (error) {
    if (error instanceof DocuSignConfigurationError) {
      return {
        ready: false,
        missing: error.missing,
        message: error.message,
      };
    }

    throw error;
  }
}

export function buildDocuSignConsentUrl() {
  const config = getDocuSignConfig();
  const params = new URLSearchParams({
    response_type: "code",
    scope: "signature impersonation",
    client_id: config.integrationKey,
    redirect_uri: config.consentRedirectUri,
  });

  return `https://${config.authServer}/oauth/auth?${params.toString()}`;
}

export function getEmbeddedSigningOrigins(requestOrigin) {
  const config = getDocuSignConfig();
  const originSet = new Set(config.allowedOrigins);

  if (requestOrigin) {
    originSet.add(new URL(requestOrigin).origin);
  }

  originSet.add(config.appsOrigin);

  return {
    frameAncestors: Array.from(originSet),
    messageOrigins: [config.appsOrigin],
  };
}

export function getDocuSignSigningReturnUrl(requestOrigin) {
  const configuredReturnUrl = process.env.DOCUSIGN_SIGNING_RETURN_URL?.trim();

  if (configuredReturnUrl) {
    return configuredReturnUrl;
  }

  return `${new URL(requestOrigin).origin}/signing-complete`;
}
