import React from 'react'
import "../../homepage.css"
import Link from 'next/link'
import { AGREEMENT_DEFINITIONS } from '@/lib/agreements'

export default function Pricing() {
  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <div className="reveal">
          <span className="section-label">The MenuBoard</span>
          <h2 className="section-title">Flat-fee. No products. No pressure.</h2>
        </div>
        <div className="pricing-grid reveal" style={{ transitionDelay: "0.1s" }}>
          <div className="pricing-card featured">
            <div className="pricing-badge">Core Program</div>
            <div className="pricing-name">Financial Orientation</div>
            <div className="pricing-price">$500 <span>/ 1 year</span></div>
            <div className="pricing-desc">A flat-fee educational engagement to foster financial clarity and confidence. Forge Fog into Focus.</div>
            <ul className="pricing-features">
              <li>Learn core financial concepts and trade-offs</li>
              <li>Ask real-world questions, anytime</li>
              <li>Conversations by phone, Zoom, or in person</li>
              <li>Guidance without products, pressure, or pitches</li>
              <li>Access to 360-point compendium of essential terms</li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={`/agreements/${AGREEMENT_DEFINITIONS["financial-orientation"].slug}`}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Click Here to Review the Agreement -&gt;
              </Link>
            </div>
          </div>
          <div className="pricing-card">
            <div className="pricing-badge" style={{ background: "#cececeef", border: "1px solid var(--border)", color: "var(--red)" }}>Add-on</div>
            <div className="pricing-name">Premium Expansion Pack</div>
            <div className="pricing-price">+$250</div>
            <div className="pricing-desc">For orienteers who value structure, tools, and accountability.</div>
            <ul className="pricing-features">
              <li>Scheduled check-ins & follow ups</li>
              <li>Dynamic progress mapping</li>
              <li>Track assets + debts with a financial aggregator</li>
              <li>Consolidate spending data and build budgets</li>
              <li>Identify and prioritize financial goals</li>
            </ul>
            <div className="pricing-cta">
              <Link
                href={`/agreements/${AGREEMENT_DEFINITIONS["premium-expansion-pack"].slug}`}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Click Here to Review the Agreement -&gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
