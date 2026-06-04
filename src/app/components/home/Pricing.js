import React from "react";
import "../../homepage.css";
import Link from "next/link";
import { AGREEMENT_DEFINITIONS } from "@/lib/agreements";
import { getPurchaseBySlug } from "@/lib/purchases";

function getCheckoutStartHref(agreementSlug) {
  return `/logged-in/checkout?agreement=${agreementSlug}`;
}

export default function Pricing() {
  const financialServices = getPurchaseBySlug("financial-orientation");
  const premiumExpansionPack = getPurchaseBySlug("premium-expansion-pack");

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <div className="reveal">
          <span className="section-label">The MenuBoard</span>
          <h2 className="section-title">Flat-fee. No products. No pressure.</h2>
          <ul className="pricing-features reveal">
            <li>Learn core financial concepts and trade-offs</li>
            <li>
              Cut through the jargon with the 360-point Compendium of DogStar
              Definitions
            </li>
            <li>Explore 6 Supplements with 275+ more terms explained</li>
            <li>
              Direct line for your top financial questions - with fiduciary
              answers in 2 business days
            </li>
            <li>Have follow-up conversations by phone, Zoom, or in person</li>
            <li>
              Total immunity from product pitches, hidden agendas, and sales
              pressure
            </li>
          </ul>
        </div>
        {/* <div className="pricing-title">
          <span className="section-label-pric reveal">Best value</span>
        </div> */}
        <div
          className="pricing-grid reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          <div id="pricing-card" className="pricing-card">
            <div className="pricing-badge">Core Program</div>
            <div className="pricing-name">
              {/* {financialServices?.displayName ||  */}
              Guided Orientation
              {/* } */}
            </div>
            <div className="pricing-price">
              {financialServices?.priceLabel || "$500"} <span>/ 1 year</span>
            </div>
            <div className="pricing-desc">
              Your foundational toolkit for financial clarity. No sales pitches,
              no hidden fees - just the map and vocabulary you need to forge fog
              into focus.
            </div>
            <ul className="pricing-features">
              <li><span style={{ fontWeight: "bold" }}>No</span> recommendations</li>
              <li><span style={{ fontWeight: "bold" }}>No</span> investment advice</li>
              <li><span style={{ fontWeight: "bold" }}>No</span> asset management</li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["financial-orientation"].slug,
                )}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Start Guided Orientation -&gt;
              </Link>
            </div>
          </div>
          <div className="pricing-card featured">
            <div
              className="pricing-badge"
              style={{
                background: "#cececeef",
                border: "1px solid var(--border)",
                color: "var(--red)",
              }}
            >
              Premium Program
            </div>
            <div className="pricing-name">
              {premiumExpansionPack?.displayName || "Premium Expansion Pack"}
            </div>
            <div className="pricing-price">
              {premiumExpansionPack?.priceLabel || "$750"} <span>/ 1 year</span>
            </div>
            <div className="pricing-desc">
              Built for those who want real-time structure, interactive tools, and direct accountability from day one.
            </div>
            <ul className="pricing-features">
              <li>Visual tracking to see exactly where you stand</li>
              <li>Scheduled check-ins & follow ups</li>
              <li>A single secure dashboard to sync your assets, master your budget, and track real-time spending</li>
              {/* <li>View assets + debts</li>
              <li>Track Spending</li>
              <li>Build budgets</li>
              <li>Set + prioritize goals</li> */}
            </ul>
            <div className="pricing-cta">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["premium-expansion-pack"].slug,
                )}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Start Premium Expansion -&gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
