import "server-only";

export class DocuSignConfigurationError extends Error {
  constructor(message, missing = []) {
    super(message);
    this.name = "DocuSignConfigurationError";
    this.missing = missing;
  }
}

export class DocuSignConsentRequiredError extends Error {
  constructor(consentUrl) {
    super("DocuSign consent is required before JWT auth can succeed.");
    this.name = "DocuSignConsentRequiredError";
    this.consentUrl = consentUrl;
  }
}

export class DocuSignApiError extends Error {
  constructor(message, { status = 500, details = null } = {}) {
    super(message);
    this.name = "DocuSignApiError";
    this.status = status;
    this.details = details;
  }
}
