import React from 'react'
import "../../homepage.css"

export default function Plan() {
  return (
    <section id="plan" className="plan">
      <div className="container">
        <div className="reveal">
          <span className="section-label">The Process</span>
          <h2 className="section-title">Five moves. Zero mystery.</h2>
        </div>
        <div className="plan-steps reveal" style={{ transitionDelay: "0.1s" }}>
          <div className="plan-step">
            <div className="step-num">1</div>
            <div className="step-title">Review <br />the Offer</div>
            <div className="step-body">Explore program tiers and pricing on the MenuBoard.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num">2</div>
            <div className="step-title">Unlock <br /> the ScoreCard</div>
            <div className="step-body">Begin building awareness. It is yours to keep for free.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num">3</div>
            <div className="step-title">Endorse <br /> the Agreement</div>
            <div className="step-body">Select your orientation tier and get underway.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num">4</div>
            <div className="step-title">Ask <br />What Matters</div>
            <div className="step-body">Submit your questions. Receive fiduciary-level responses. Repeat.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num">5</div>
            <div className="step-title">Decide <br /> Your Next Step</div>
            <div className="step-body">Act with the steadiness that comes from real understanding.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
