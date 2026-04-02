import Link from "next/link";
import { notFound } from "next/navigation";
import { AGREEMENT_DEFINITIONS, getAgreementBySlug } from "@/lib/agreements";

export async function generateMetadata({ params }) {
  const { agreementSlug } = await params;
  const agreement = getAgreementBySlug(agreementSlug);

  if (!agreement) {
    return {
      title: "Agreement Not Found | Far Flung Change",
    };
  }

  return {
    title: `${agreement.packageName} Agreement | Far Flung Change`,
    description: agreement.shortDescription,
  };
}

export default async function AgreementPage({ params }) {
  const { agreementSlug } = await params;
  const agreement = getAgreementBySlug(agreementSlug);
  const orientationAgreement = AGREEMENT_DEFINITIONS["financial-orientation"];
  const addonAgreement = AGREEMENT_DEFINITIONS["premium-expansion-pack"];
  const showAddonLink =
    agreement?.slug === "financial-orientation" && addonAgreement;
  const showOrientationLink =
    agreement?.slug === "premium-expansion-pack" && orientationAgreement;

  if (!agreement) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 1.5rem 4rem",
        background:
          "radial-gradient(circle at top, rgba(231, 76, 60, 0.16), transparent 24rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "54rem",
          margin: "0 auto",
          border: "1px solid rgba(245, 240, 232, 0.12)",
          background: "rgba(10, 10, 10, 0.9)",
          padding: "clamp(1.5rem, 3vw, 3rem)",
        }}
      >
        <p
          style={{
            color: "var(--red-hot)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Agreement Preview
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(2.75rem, 7vw, 5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          {agreement.packageName}
        </h1>
        <p
          style={{
            color: "var(--white)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          {agreement.priceLabel}
        </p>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.8)",
            lineHeight: "1.9",
            marginBottom: "1rem",
          }}
        >
          {agreement.viewerIntro}
        </p>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.68)",
            lineHeight: "1.9",
            marginBottom: "2rem",
          }}
        >
          This page is a package-specific review screen so each pricing button can route to the
          right agreement. The final signing flow uses the same agreement definition.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.85rem",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            href={`/logged-in/docusign?agreement=${agreement.slug}`}
            style={{
              display: "inline-block",
              padding: "0.95rem 1.25rem",
              border: "1px solid var(--red)",
              background: "var(--red)",
              color: "var(--white)",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {agreement.ctaLabel}
          </Link>
          {showAddonLink ? (
            <Link
              href={`/agreements/${addonAgreement.slug}`}
              style={{
                display: "inline-block",
                padding: "0.95rem 1.25rem",
                border: "1px solid rgba(245, 240, 232, 0.18)",
                background: "transparent",
                color: "var(--white)",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              View Addon Agreement
            </Link>
          ) : null}
          {showOrientationLink ? (
            <Link
              href={`/agreements/${orientationAgreement.slug}`}
              style={{
                display: "inline-block",
                padding: "0.95rem 1.25rem",
                border: "1px solid rgba(245, 240, 232, 0.18)",
                background: "transparent",
                color: "var(--white)",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              View Orientation Agreement
            </Link>
          ) : null}
          <Link
            href="/agreements"
            style={{
              display: "inline-block",
              padding: "0.95rem 1.25rem",
              border: "1px solid rgba(245, 240, 232, 0.18)",
              background: "transparent",
              color: "var(--white)",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Back To Agreements
          </Link>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {agreement.sections.map((section) => (
            <section
              key={section.heading}
              style={{
                borderTop: "1px solid rgba(245, 240, 232, 0.12)",
                paddingTop: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.9rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.85rem",
                  color: "var(--white)",
                }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  style={{
                    color: "rgba(245, 240, 232, 0.74)",
                    lineHeight: "1.9",
                    marginBottom: "0.9rem",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
