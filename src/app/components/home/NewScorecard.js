import React from 'react'
import Link from 'next/link'

const HOLES = [
  'Accounts',
  'Reserves',
  'Debts',
  'Protection',
  'Benefits',
  'Savings',
  'Taxes',
  'Cash Flow',
  'Net$Worth',
  'Spending',
  'Timing',
  'Choices',
  'Lifestyle',
  'Purchases',
  'Family',
  'Volatility',
  'Investing',
  'Clarity',
]

export default function NewScorecard() {
  return (
    <div className="scorecard" id="scorecard">
      <div className="container">
        <div className="scorecard-inner">
          <div className="scorecard-copy reveal">
            <span className="section-label">Start Here - Free</span>
            <h2 className="section-title">Your Orientation ScoreCard</h2>
            <p>
              The ScoreCard is your personal field guide through 18 essential areas of financial
              life - from Accounts and Cash Flow to Investing and Clarity.
            </p>
            <p>
              Think of it as your course map before the round begins. Unlock it free. Keep it. Use
              it to track where you are and what comes next.
            </p>
            <Link
              href="/logged-in"
              className="btn-ghost"
              style={{ marginTop: '1rem', display: 'inline-block' }}
            >
              Unlock ScoreCard -&gt;
            </Link>
          </div>
          <div className="scorecard-visual reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="hole-grid">
              {HOLES.map((name, index) => (
                <div key={name} className="hole">
                  <span className="hole-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="hole-name">{name}</span>
                  <span className={`hole-status${index === HOLES.length - 1 ? ' begun' : ''}`}></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}