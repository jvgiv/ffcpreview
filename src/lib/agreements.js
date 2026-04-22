export const AGREEMENT_DEFINITIONS = {
  "financial-orientation": {
    slug: "financial-orientation",
    packageName: "Financial Orientation",
    agreementTitle: "Financial Orientation Agreement",
    priceLabel: "$500 / 1 year",
    shortDescription:
      "A flat-fee educational engagement focused on financial clarity, confidence, and foundational decision support.",
    viewerIntro:
      "This agreement covers the core Financial Orientation package. It is the agreement a visitor should review before purchasing the $500 program.",
    ctaLabel: "Continue To Signing",
    sections: [
      {
        heading: "Scope of Engagement",
        paragraphs: [
          "Far Flung Change provides educational financial orientation designed to help the client understand concepts, trade-offs, and practical next steps.",
          "This engagement is for education and coaching support only. It does not include product sales, securities recommendations, tax preparation, or legal advice.",
        ],
      },
      {
        heading: "Program Access",
        paragraphs: [
          "The Financial Orientation package includes one year of access to educational conversations, term definitions, and decision-support guidance delivered by phone, video, or in person when available.",
          "Response times, scheduling availability, and communication channels may vary, but the goal of the engagement is steady access to clarity rather than transactional product placement.",
        ],
      },
      {
        heading: "Client Responsibilities",
        paragraphs: [
          "The client remains responsible for all final financial decisions and for confirming whether any strategy should be reviewed with licensed legal, tax, or investment professionals.",
          "The client agrees to provide accurate information when requesting guidance so educational conversations can remain relevant and useful.",
        ],
      },
      {
        heading: "Fee",
        paragraphs: [
          "The total fee for this package is $500 for a one-year term unless both parties agree otherwise in writing.",
          "The fee is charged for access to the educational engagement itself and is not contingent on any financial outcome.",
        ],
      },
      {
        heading: "Acknowledgment",
        paragraphs: [
          "By signing, the client acknowledges that this is an educational agreement centered on financial literacy and decision support rather than advisory product implementation.",
        ],
      },
    ],
  },
  "premium-expansion-pack": {
    slug: "premium-expansion-pack",
    packageName: "Premium Expansion Pack",
    agreementTitle: "Premium Expansion Pack Agreement",
    priceLabel: "$750 / 1 year",
    shortDescription:
      "A premium engagement for clients who want more structure, recurring accountability, and organized progress tracking.",
    viewerIntro:
      "This agreement covers the Premium Expansion Pack package. It is the agreement a visitor should review before purchasing the $750 premium engagement.",
    ctaLabel: "Continue To Premium Expansion Signing",
    sections: [
      {
        heading: "Premium Scope",
        paragraphs: [
          "The Premium Expansion Pack is intended for clients who want additional structure, recurring check-ins, and accountability support.",
          "This package expands the level of ongoing process support and progress visibility available through the engagement.",
        ],
      },
      {
        heading: "Included Features",
        paragraphs: [
          "The add-on may include scheduled follow-ups, progress mapping, budgeting support, goal prioritization, and aggregation-based financial organization tools when available.",
          "Specific tools or workflows may change over time as long as the core objective of improved structure and accountability remains intact.",
        ],
      },
      {
        heading: "Data and Tools",
        paragraphs: [
          "If third-party tools are used for account aggregation or budgeting workflows, the client understands those services may have separate terms, uptime limitations, and privacy practices.",
          "Far Flung Change will use reasonable care in selecting workflows, but cannot guarantee the uninterrupted availability of external software providers.",
        ],
      },
      {
        heading: "Fee",
        paragraphs: [
          "The total fee for this package is $750 for a one-year term unless both parties agree otherwise in writing.",
          "Because this package reserves additional time and operational support, fees are for access to the premium service itself rather than guaranteed outcomes.",
        ],
      },
      {
        heading: "Acknowledgment",
        paragraphs: [
          "By signing, the client acknowledges that this add-on expands support structure and accountability while leaving all final financial decisions with the client.",
        ],
      },
    ],
  },
};

export function getAgreementBySlug(slug) {
  if (!slug) {
    return null;
  }

  return AGREEMENT_DEFINITIONS[slug] || null;
}

export function getAgreementDocumentHtml({ agreement, signerName }) {
  const renderedSections = agreement.sections
    .map(
      (section) => `
        <section class="agreement-section">
          <h2>${section.heading}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </section>
      `
    )
    .join("");

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${agreement.agreementTitle}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #161616;
        margin: 48px;
        line-height: 1.65;
      }

      h1 {
        margin-bottom: 8px;
      }

      h2 {
        margin: 28px 0 10px;
        font-size: 20px;
      }

      p {
        margin: 0 0 12px;
      }

      .meta {
        color: #666;
        margin-bottom: 32px;
      }

      .agreement-section {
        margin-bottom: 10px;
      }

      .signature-grid {
        margin-top: 56px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .signature-box {
        border-top: 1px solid #1f1f1f;
        padding-top: 12px;
        min-height: 72px;
      }
    </style>
  </head>
  <body>
    <h1>${agreement.agreementTitle}</h1>
    <p class="meta">Prepared for ${signerName} through the Far Flung Change signing flow.</p>
    <p>${agreement.viewerIntro}</p>
    ${renderedSections}

    <section class="signature-grid">
      <div class="signature-box">
        <strong>Signer</strong><br />
        /sn1/
      </div>
      <div class="signature-box">
        <strong>Date Signed</strong><br />
        /ds1/
      </div>
    </section>
  </body>
</html>
  `.trim();
}
