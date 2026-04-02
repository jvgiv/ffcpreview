import React from "react";
import Link from "next/link";
import "../../homepage.css";
import { AGREEMENT_DEFINITIONS } from "@/lib/agreements";

const agreements = [
  AGREEMENT_DEFINITIONS["financial-orientation"],
  AGREEMENT_DEFINITIONS["premium-expansion-pack"],
];

export default function Agreements() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 1.5rem 4rem",
        background:
          "radial-gradient(circle at top, rgba(231, 76, 60, 0.15), transparent 24rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
      }}
    >
      <div className="container">
        <section
          className="reveal"
          style={{
            maxWidth: "44rem",
            marginBottom: "2.5rem",
          }}
        >
          <span className="section-label">Agreement Center</span>
          <h1 className="section-title" style={{ marginBottom: "1rem" }}>
            Review the right agreement before you move forward.
          </h1>
          <p
            style={{
              color: "rgba(245, 240, 232, 0.72)",
              lineHeight: "1.9",
              maxWidth: "38rem",
            }}
          >
            Each package has its own agreement. Choose the core Financial Orientation agreement or
            the Premium Expansion Pack add-on agreement to review the details in the same Far Flung
            Change flow.
          </p>
        </section>

        <section
          className="pricing-grid reveal"
          style={{
            transitionDelay: "0.1s",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {agreements.map((agreement) => (
            <article
              key={agreement.slug}
              className={`pricing-card ${
                agreement.slug === "financial-orientation" ? "featured" : ""
              }`}
            >
              <div
                className="pricing-badge"
                style={
                  agreement.slug === "premium-expansion-pack"
                    ? {
                        background: "#cececeef",
                        border: "1px solid var(--border)",
                        color: "var(--red)",
                      }
                    : undefined
                }
              >
                {agreement.slug === "financial-orientation" ? "Core Program" : "Add-on"}
              </div>
              <div className="pricing-name">{agreement.packageName}</div>
              <div className="pricing-price">{agreement.priceLabel}</div>
              <div className="pricing-desc">{agreement.shortDescription}</div>
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid rgba(245, 240, 232, 0.1)",
                }}
              >
                <p
                  style={{
                    color: "rgba(245, 240, 232, 0.62)",
                    lineHeight: "1.8",
                    marginBottom: "1.25rem",
                  }}
                >
                  {agreement.viewerIntro}
                </p>
                <Link
                  href={`/agreements/${agreement.slug}`}
                  className="btn-primary"
                  style={{ width: "100%", textAlign: "center", display: "block" }}
                >
                  Review Agreement -&gt;
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
