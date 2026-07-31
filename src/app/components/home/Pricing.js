import React from "react";
import "../../homepage.css";
import "./pricing.css";
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
          <h2 className="section-title">
            Flat-fee. <span style={{ color: "var(--red)" }}>No</span> products.{" "}
            <span style={{ color: "var(--red)" }}>No</span> pressure.
          </h2>

          <div className="tm-box">
            <div className="tm-content" style={{ flex: "1" }}>
              <div className="tm-head">
                Your <span className="mid">Treasure</span> Map
              </div>
              <div className="tm-desc">
                Every Orienteer gets one,{" "}
                <strong>Core and Premium alike.</strong> Your facts and your
                perspective, brought together into one clear, personal picture
                of where you stand. It's not an upgrade. It's the starting
                point.
              </div>
            </div>
          </div>

          {/* <ul className="pricing-features reveal">
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
          </ul> */}
          <div className="included-title">Every Plan Includes</div>
          <div className="bullets">
            <div className="bullet">
              <span className="dot">•</span> The Compendium of DogStar
              Definitions — 650+ terms in plain language
            </div>
            <div className="bullet">
              <span className="dot">•</span> Your Direct Line — fiduciary
              answers to real questions, within 2 business days
            </div>
            <div className="bullet">
              <span className="dot">•</span> Follow-up conversations by phone,
              Zoom, or in person
            </div>
            <div className="bullet">
              <span className="dot">•</span> Total immunity from product
              pitches, hidden agendas, and sales pressure
            </div>
          </div>
        </div>
        {/* <div className="pricing-title">
          <span className="section-label-pric reveal">Best value</span>
        </div> */}
        <br />
        <a
          href="/files/agreement.pdf"
          target="_blank"
          className="btn-ghost reveal"
        >
          View Agreement
        </a>

        <div className="tiers">
          <div className="tier">
            <div className="tier-tag core">Core Program</div>
            <div className="tier-label">What's Included</div>
            <div className="tier-price">
              $500 <span>/ 1 year Caddy Service</span>
            </div>
            <div className="tier-desc">
              Your foundational toolkit for financial clarity. Your Treasure Map
              and your Vocabulary, nothing else attached.
            </div>

            <div className="tier-feature">
              <span className="no">No</span> recommendations
            </div>
            <div className="tier-feature">
              <span className="no">No</span> investment advice
            </div>
            <div className="tier-feature">
              <span className="no">No</span> asset management
            </div>


            <div className="tier-cta-wrapper">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["financial-orientation"].slug,
                )}
                className="btn-primary tier-cta"
              >
                Start Core Program
              </Link>
            </div>
            {/* <a className="tier-btn" href="#">
              Begin Core
            </a> */}
          </div>

          <div className="tier premium">
            <div className="tier-tag premium-tag">Premium Program</div>
            <div className="tier-label">What's Included</div>
            <div className="tier-price">
              $750 <span>/ 1 year Caddy Service</span>
            </div>
            <div className="tier-desc">
              Everything in Core, plus real-time structure and accountability
              built around your Treasure Map.
            </div>

            <div className="tier-feature">
              <span className="yes">Your Treasure Map, kept live</span> — synced
              to a secure dashboard
            </div>
            <div className="tier-feature">
              <span className="yes">Visual tracking</span> to see exactly where
              you stand
            </div>
            <div className="tier-feature">
              <span className="yes">Scheduled check-ins</span> and follow-ups
            </div>

            <div className="tier-cta-wrapper">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["premium-expansion-pack"].slug,
                )}
                className="btn-primary tier-cta"
              >
                Start Premium Program
              </Link>
            </div>
            {/* <a className="tier-btn" href="#">Begin Premium</a> */}
          </div>
        </div>

        {/* <div
          className="pricing-grid reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          <div id="pricing-card" className="pricing-card">
            <div className="pricing-badge">Core Program</div>
            <div className="pricing-name">
              WHAT'S INCLUDED

            </div>
            <div className="pricing-price">
              {financialServices?.priceLabel || "$500"}{" "}
              <span>/ 1 year Caddy Service</span>
            </div>
            <div className="pricing-desc">
              Your foundational toolkit for financial clarity. No sales pitches,
              no hidden fees - just the map and vocabulary you need to forge fog
              into focus.
            </div>
            <ul className="pricing-features">
              <li>
                <span style={{ fontWeight: "bold" }}>No</span> recommendations
              </li>
              <li>
                <span style={{ fontWeight: "bold" }}>No</span> investment advice
              </li>
              <li>
                <span style={{ fontWeight: "bold" }}>No</span> asset management
              </li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["financial-orientation"].slug,
                )}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Start Core Program
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
              WHAT'S INCLUDED
            </div>
            <div className="pricing-price">
              {premiumExpansionPack?.priceLabel || "$750"}{" "}
              <span>/ 1 year Caddy Service</span>
            </div>
            <div className="pricing-desc">
              Built for those who want real-time structure, interactive tools,
              and direct accountability from day one.
            </div>
            <ul className="pricing-features">
              <li>Visual tracking to see exactly where you stand</li>
              <li>Scheduled check-ins & follow ups</li>
              <li>
                A single secure dashboard to sync your assets, master your
                budget, and track real-time spending
              </li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["premium-expansion-pack"].slug,
                )}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Start Premium Program
              </Link>
            </div>
          </div>
        </div> */}
        <br />
      </div>
    </section>
  );
}
