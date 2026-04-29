import React from 'react'
import "../../homepage.css"
import Link from 'next/link'
import { AGREEMENT_DEFINITIONS } from '@/lib/agreements'
import { getPurchaseBySlug } from '@/lib/purchases'

function getCheckoutStartHref(agreementSlug) {
  return `/logged-in/checkout?agreement=${agreementSlug}`
}

export default function Pricing() {
  const financialServices = getPurchaseBySlug("financial-orientation")
  const premiumExpansionPack = getPurchaseBySlug("premium-expansion-pack")

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <div className="reveal">
          <span className="section-label">The MenuBoard</span>
          <h2 className="section-title">Flat-fee. No products. No pressure.</h2>
        <ul className="pricing-features reveal">
          <li>Learn core financial concepts and trade-offs</li>
          <li>Access a 360-point Compendium of DogStar Definitions</li>
          <li>Explore 6 Supplements with 275+ more terms explained</li>
          <li>Ask any questions - anytime: get answers - in 2 business days</li>
          <li>Have follow-up conversations by phone, Zoom, or in person</li>
          <li>Process information without products, pressure, or pitches</li>
        </ul>
        </div>
        <div className="pricing-grid reveal" style={{ transitionDelay: "0.1s" }}>
          <div className="pricing-card featured">
            <div className="pricing-badge">Core Program</div>
            <div className="pricing-name">{financialServices?.displayName || "Guided Orientation"}</div>
            <div className="pricing-price">{financialServices?.priceLabel || "$500"} <span>/ 1 year</span></div>
            <div className="pricing-desc">A flat-fee educational engagement to foster financial clarity and confidence. Forge Fog into Focus.</div>
            <ul className="pricing-features">
              <li>No recommendations</li>
              <li>No advice</li>
              <li>No management</li>
              <li>No implementation</li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["financial-orientation"].slug
                )}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Start Financial Services -&gt;
              </Link>
            </div>
          </div>
          <div className="pricing-card">
            <div className="pricing-badge" style={{ background: "#cececeef", border: "1px solid var(--border)", color: "var(--red)" }}>Premium Program</div>
            <div className="pricing-name">{premiumExpansionPack?.displayName || "Premium Expansion Pack"}</div>
            <div className="pricing-price">{premiumExpansionPack?.priceLabel || "$750"}</div>
            <div className="pricing-desc">For members who value more structure, tools, and accountability from the start.</div>
            <ul className="pricing-features">
              <li>Dynamic progress mapping</li>
              <li>Scheduled check-ins & follow ups</li>
              <li>Personal financial aggregator to:</li>
              <li>View assets + debts</li>
              <li>Track Spending</li>
              <li>Build budgets</li>
              <li>Set + prioritize goals</li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={getCheckoutStartHref(
                  AGREEMENT_DEFINITIONS["premium-expansion-pack"].slug
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
  )
}
