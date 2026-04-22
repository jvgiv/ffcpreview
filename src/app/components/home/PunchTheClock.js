import React from 'react'
import Link from 'next/link'

export default function PunchTheClock() {
  return (
    <div className="final-cta" id="cta">
      <div className="container">
        <div className="reveal">
          <span className="section-label">Momentum Begins Here</span>
          <h2 className="section-title display">
            Punch
            <br />
            <span className="red">The Clock.</span>
          </h2>
          <p>
            Confidence comes with clarity. If you're ready to understand what you're deciding and
            agreeing to, if you're ready to move forward with steadiness, this is where it starts.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/#pricing"
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '1.1rem 2.5rem' }}
            >
              Get Oriented - $500 / Year -&gt;
            </Link>
            <Link
              href="/#scorecard"
              className="btn-ghost"
              style={{ fontSize: '0.85rem', padding: '1.1rem 2.5rem' }}
            >
              Free ScoreCard First
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
