import "server-only";

import { getDocuSignSession } from "@/lib/docusign/auth";
import { DocuSignApiError } from "@/lib/docusign/errors";

function buildCombinedDocumentPath(accountId, envelopeId) {
  return `/v2.1/accounts/${encodeURIComponent(accountId)}/envelopes/${encodeURIComponent(envelopeId)}/documents/combined`;
}

function sanitizeFilenamePart(value) {
  return String(value || "document")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export async function downloadCombinedEnvelopeDocument({ envelopeId, accountId, fileLabel }) {
  const session = await getDocuSignSession();
  const resolvedAccountId = accountId || session.accountId;
  const response = await fetch(`${session.basePath}${buildCombinedDocumentPath(resolvedAccountId, envelopeId)}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: "application/pdf",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new DocuSignApiError(
      "Unable to download the DocuSign combined document.",
      {
        status: response.status,
        details: text ? { raw: text } : null,
      }
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const safeLabel = sanitizeFilenamePart(fileLabel || envelopeId || "signed-document");

  return {
    bytes: Buffer.from(arrayBuffer),
    filename: `${safeLabel || "signed-document"}.pdf`,
  };
}
