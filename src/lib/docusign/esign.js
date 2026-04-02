import "server-only";

import crypto from "node:crypto";
import { getDocuSignSession } from "./auth";
import { getEmbeddedSigningOrigins } from "./config";
import { DocuSignApiError } from "./errors";
import { getAgreementBySlug, getAgreementDocumentHtml } from "@/lib/agreements";

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

async function postToDocuSign(session, pathname, body) {
  const response = await fetch(`${session.basePath}${pathname}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await response.text();
  const data = parseJsonText(text);

  if (!response.ok) {
    throw new DocuSignApiError(data?.message || "A DocuSign API call failed.", {
      status: response.status,
      details: data,
    });
  }

  return data;
}

async function createEnvelope({
  signerName,
  signerEmail,
  agreement,
  clientUserId,
}) {
  const session = await getDocuSignSession();
  const htmlDocument = getAgreementDocumentHtml({
    agreement,
    signerName,
  });
  const envelopeDefinition = {
    emailSubject: agreement.agreementTitle,
    documents: [
      {
        documentBase64: Buffer.from(htmlDocument).toString("base64"),
        name: `${agreement.agreementTitle}.html`,
        fileExtension: "html",
        documentId: "1",
      },
    ],
    recipients: {
      signers: [
        {
          email: signerEmail,
          name: signerName,
          recipientId: "1",
          routingOrder: "1",
          clientUserId,
          tabs: {
            signHereTabs: [
              {
                anchorString: "/sn1/",
                anchorUnits: "pixels",
                anchorXOffset: "20",
                anchorYOffset: "-12",
              },
            ],
            dateSignedTabs: [
              {
                anchorString: "/ds1/",
                anchorUnits: "pixels",
                anchorXOffset: "0",
                anchorYOffset: "-12",
              },
            ],
          },
        },
      ],
    },
    status: "sent",
  };

  const data = await postToDocuSign(
    session,
    `/v2.1/accounts/${encodeURIComponent(session.accountId)}/envelopes`,
    envelopeDefinition
  );

  return {
    session,
    envelopeId: data?.envelopeId || data?.envelope_id,
  };
}

async function createRecipientView({
  session,
  envelopeId,
  signerName,
  signerEmail,
  clientUserId,
  returnUrl,
  requestOrigin,
}) {
  const { frameAncestors, messageOrigins } = getEmbeddedSigningOrigins(requestOrigin);
  const recipientViewRequest = {
    returnUrl,
    authenticationMethod: "none",
    email: signerEmail,
    userName: signerName,
    clientUserId,
    frameAncestors,
    messageOrigins,
  };
  const data = await postToDocuSign(
    session,
    `/v2.1/accounts/${encodeURIComponent(session.accountId)}/envelopes/${encodeURIComponent(envelopeId)}/views/recipient`,
    recipientViewRequest
  );

  return data?.url;
}

export async function createEmbeddedSigningSession({
  signerName,
  signerEmail,
  agreementSlug,
  requestOrigin,
  returnUrl,
}) {
  const normalizedName = signerName.trim();
  const normalizedEmail = signerEmail.trim().toLowerCase();
  const agreement = getAgreementBySlug(agreementSlug);
  const clientUserId = crypto.randomUUID();

  if (!agreement) {
    throw new DocuSignApiError("The requested agreement was not found.", {
      status: 400,
      details: { agreementSlug },
    });
  }

  const { session, envelopeId } = await createEnvelope({
    signerName: normalizedName,
    signerEmail: normalizedEmail,
    agreement,
    clientUserId,
  });

  if (!envelopeId) {
    throw new DocuSignApiError("DocuSign did not return an envelope ID.", {
      status: 502,
    });
  }

  const recipientViewUrl = await createRecipientView({
    session,
    envelopeId,
    signerName: normalizedName,
    signerEmail: normalizedEmail,
    clientUserId,
    returnUrl,
    requestOrigin,
  });

  if (!recipientViewUrl) {
    throw new DocuSignApiError("DocuSign did not return a recipient view URL.", {
      status: 502,
    });
  }

  return {
    envelopeId,
    recipientViewUrl,
    agreementTitle: agreement.agreementTitle,
    agreementSlug: agreement.slug,
    docuSignSession: {
      accountId: session.accountId,
      basePath: session.basePath,
    },
  };
}
