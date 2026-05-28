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
            <div className="step-body">Assess your current financial standing now.  It&apos;s completely free and yours to keep.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num">3</div>
            <div className="step-title">Lock In <br /> Your Tier</div>
            <div className="step-body">Pick the flat-fee plan that fits your pace and clear the fog.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num">4</div>
            <div className="step-title">Ask <br />What Matters</div>
            <div className="step-body">Fire away your real-world questions.  Get clear, fiduciary-level answers in two business days.</div>
            <div className="step-arrow"></div>
          </div>
          <div className="plan-step">
            <div className="step-num"><span style={{ color: "#d91f2c" }}>5</span></div>
            <div className="step-title">Decide <br /> Your Next Step</div>
            <div className="step-body"><span style={{color: "var(--white)"}}>Move forward with absolute certainty.  No guessing, no pressure, just a clear map.</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
