import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { getDocuSignSession } from "./auth";
import { getEmbeddedSigningOrigins } from "./config";
import { DocuSignApiError } from "./errors";
import { getAgreementBySlug } from "@/lib/agreements";

const AGREEMENT_PDF_PATH = path.join(process.cwd(), "public", "files", "agreement.pdf");
const AGREEMENT_DOCUMENT_ID = "1";
// These coordinates are matched to the static agreement.pdf layout so the
// visual check marks and signature widgets stay aligned with the printed form.
const AGREEMENT_LAYOUT = {
  selectionMarks: {
    firstOrienteerBasic: {
      pageNumber: "2",
      xPosition: "67",
      yPosition: "221",
    },
    firstOrienteerPremium: {
      pageNumber: "2",
      xPosition: "67",
      yPosition: "379",
    },
    additionalOrienteerBasic: {
      pageNumber: "2",
      xPosition: "67",
      yPosition: "468",
    },
    additionalOrienteerPremium: {
      pageNumber: "2",
      xPosition: "67",
      yPosition: "490",
    },
  },
  orienteerFields: {
    firstPhone: {
      pageNumber: "5",
      xPosition: "310",
      yPosition: "455",
    },
    firstEmail: {
      pageNumber: "5",
      xPosition: "448",
      yPosition: "455",
    },
    secondPhone: {
      pageNumber: "5",
      xPosition: "310",
      yPosition: "495",
    },
    secondEmail: {
      pageNumber: "5",
      xPosition: "448",
      yPosition: "495",
    },
  },
  signHere: {
    pageNumber: "5",
    xPosition: "76",
    yPosition: "396",
  },
  dateSigned: {
    pageNumber: "5",
    xPosition: "350",
    yPosition: "396",
  },
};

let agreementPdfBase64Promise;

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

async function getAgreementPdfBase64() {
  if (!agreementPdfBase64Promise) {
    agreementPdfBase64Promise = fs
      .readFile(AGREEMENT_PDF_PATH)
      .then((documentBuffer) => documentBuffer.toString("base64"));
  }

  return agreementPdfBase64Promise;
}

function buildAnchorTabBase({
  tabLabel,
  anchorString,
  anchorXOffset = "0",
  anchorYOffset = "0",
  anchorOccurrence = "1",
}) {
  return {
    tabLabel,
    documentId: AGREEMENT_DOCUMENT_ID,
    anchorString,
    anchorUnits: "pixels",
    anchorXOffset: String(anchorXOffset),
    anchorYOffset: String(anchorYOffset),
    anchorOccurrence: String(anchorOccurrence),
    anchorIgnoreIfNotPresent: "false",
  };
}

function buildPositionTabBase({
  tabLabel,
  pageNumber,
  xPosition,
  yPosition,
}) {
  return {
    tabLabel,
    documentId: AGREEMENT_DOCUMENT_ID,
    pageNumber: String(pageNumber),
    xPosition: String(xPosition),
    yPosition: String(yPosition),
  };
}

function buildPrefilledTextTab({
  tabLabel,
  value,
  anchorString,
  anchorXOffset = "0",
  anchorYOffset = "0",
  anchorOccurrence = "1",
  width = "200",
  height = "18",
  fontSize = "size10",
  bold = "false",
}) {
  if (!value) {
    return null;
  }

  return {
    ...buildAnchorTabBase({
      tabLabel,
      anchorString,
      anchorXOffset,
      anchorYOffset,
      anchorOccurrence,
    }),
    value,
    width: String(width),
    height: String(height),
    font: "helvetica",
    fontSize,
    bold,
    required: "false",
    locked: "true",
  };
}

function buildPrefilledPositionTab({
  tabLabel,
  value,
  pageNumber,
  xPosition,
  yPosition,
  width = "200",
  height = "18",
  fontSize = "size10",
  bold = "false",
}) {
  if (!value) {
    return null;
  }

  return {
    ...buildPositionTabBase({
      tabLabel,
      pageNumber,
      xPosition,
      yPosition,
    }),
    value,
    width: String(width),
    height: String(height),
    font: "helvetica",
    fontSize,
    bold,
    required: "false",
    locked: "true",
  };
}

function buildSelectionMarkTab({
  tabLabel,
  pageNumber,
  xPosition,
  yPosition,
}) {
  return {
    ...buildPositionTabBase({
      tabLabel,
      pageNumber,
      xPosition,
      yPosition,
    }),
    value: "X",
    width: "12",
    height: "12",
    font: "helvetica",
    fontSize: "size10",
    bold: "true",
    required: "false",
    locked: "true",
  };
}

function buildAgreementTabs({ checkout, signerName }) {
  const textTabs = [
    checkout.basePlanTier === "basic"
      ? buildSelectionMarkTab({
          tabLabel: "first-orienteer-basic",
          ...AGREEMENT_LAYOUT.selectionMarks.firstOrienteerBasic,
        })
      : null,
    checkout.basePlanTier === "premium"
      ? buildSelectionMarkTab({
          tabLabel: "first-orienteer-premium",
          ...AGREEMENT_LAYOUT.selectionMarks.firstOrienteerPremium,
        })
      : null,
    checkout.additionalPlanTier === "basic" && checkout.additionalCount > 0
      ? buildSelectionMarkTab({
          tabLabel: "additional-orienteer-basic",
          ...AGREEMENT_LAYOUT.selectionMarks.additionalOrienteerBasic,
        })
      : null,
    checkout.additionalPlanTier === "premium" && checkout.additionalCount > 0
      ? buildSelectionMarkTab({
          tabLabel: "additional-orienteer-premium",
          ...AGREEMENT_LAYOUT.selectionMarks.additionalOrienteerPremium,
        })
      : null,
    checkout.additionalCount > 0
      ? buildPrefilledTextTab({
          tabLabel: "additional-orienteer-count",
          value: String(checkout.additionalCount),
          anchorString: "TOTAL # of Additional Orienteers ____",
          anchorOccurrence:
            checkout.additionalPlanTier === "premium" ? "2" : "1",
          anchorXOffset: "132",
          anchorYOffset: "-7",
          width: "20",
          height: "14",
          fontSize: "size10",
          bold: "true",
        })
      : null,
    buildPrefilledTextTab({
      tabLabel: "client-name",
      value: signerName,
      anchorString: "Client Name (printed)",
      anchorYOffset: "-24",
      width: "220",
    }),
    buildPrefilledTextTab({
      tabLabel: "client-tax-id",
      value: checkout.client?.taxId,
      anchorString: "Client Tax Identification Number",
      anchorYOffset: "-24",
      width: "190",
    }),
    buildPrefilledTextTab({
      tabLabel: "client-street-address",
      value: checkout.client?.streetAddress,
      anchorString: "Client Street Address",
      anchorYOffset: "-24",
      width: "220",
    }),
    buildPrefilledTextTab({
      tabLabel: "client-city-state-zip",
      value: checkout.client?.cityStateZip,
      anchorString: "Client City, State & Zip Code",
      anchorYOffset: "-24",
      width: "190",
    }),
    buildPrefilledTextTab({
      tabLabel: "orienteer-name-1",
      value: checkout.orienteers?.[0]?.name,
      anchorString: "Orienteer Name (if different)",
      anchorOccurrence: "1",
      anchorYOffset: "-24",
      width: "235",
    }),
    buildPrefilledPositionTab({
      tabLabel: "orienteer-phone-1",
      value: checkout.orienteers?.[0]?.phone,
      ...AGREEMENT_LAYOUT.orienteerFields.firstPhone,
      width: "126",
    }),
    buildPrefilledPositionTab({
      tabLabel: "orienteer-email-1",
      value: checkout.orienteers?.[0]?.email,
      ...AGREEMENT_LAYOUT.orienteerFields.firstEmail,
      width: "110",
    }),
    buildPrefilledTextTab({
      tabLabel: "orienteer-name-2",
      value: checkout.orienteers?.[1]?.name,
      anchorString: "Orienteer Name (if different)",
      anchorOccurrence: "2",
      anchorYOffset: "-24",
      width: "235",
    }),
    buildPrefilledPositionTab({
      tabLabel: "orienteer-phone-2",
      value: checkout.orienteers?.[1]?.phone,
      ...AGREEMENT_LAYOUT.orienteerFields.secondPhone,
      width: "126",
    }),
    buildPrefilledPositionTab({
      tabLabel: "orienteer-email-2",
      value: checkout.orienteers?.[1]?.email,
      ...AGREEMENT_LAYOUT.orienteerFields.secondEmail,
      width: "110",
    }),
  ].filter(Boolean);

  return {
    signHereTabs: [
      {
        ...buildPositionTabBase({
          tabLabel: "payor-signature",
          ...AGREEMENT_LAYOUT.signHere,
        }),
      },
    ],
    dateSignedTabs: [
      {
        ...buildPositionTabBase({
          tabLabel: "payor-date-signed",
          ...AGREEMENT_LAYOUT.dateSigned,
        }),
      },
    ],
    textTabs,
  };
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
  checkout,
  clientUserId,
}) {
  const session = await getDocuSignSession();
  const documentBase64 = await getAgreementPdfBase64();
  const envelopeDefinition = {
    emailSubject: agreement.agreementTitle,
    documents: [
      {
        documentBase64,
        name: "Financial Orientation Agreement.pdf",
        fileExtension: "pdf",
        documentId: AGREEMENT_DOCUMENT_ID,
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
          tabs: buildAgreementTabs({
            checkout,
            signerName,
          }),
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
  checkout,
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
    checkout,
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
