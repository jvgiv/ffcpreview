import React from 'react'
import Link from 'next/link'

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
              href="/login"
              className="btn-ghost"
              style={{ marginTop: '1rem', display: 'inline-block' }}
            >
              Unlock ScoreCard -&gt;
            </Link>
          </div>
          <div className="scorecard-visual reveal" style={{ transitionDelay: '0.15s' }}>
            <div className="hole-grid">
              <div className="hole"><span className="hole-num">①</span><span className="hole-name">Accounts</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">②</span><span className="hole-name">Reserves</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">③</span><span className="hole-name">Debts</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">④</span><span className="hole-name">Protection</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑤</span><span className="hole-name">Benefits</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑥</span><span className="hole-name">Savings</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑦</span><span className="hole-name">Taxes</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑧</span><span className="hole-name">Cash Flow</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑨</span><span className="hole-name">Net$Worth</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑩</span><span className="hole-name">Spending</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑪</span><span className="hole-name">Timing</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑫</span><span className="hole-name">Choices</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑬</span><span className="hole-name">Lifestyle</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑭</span><span className="hole-name">Purchases</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑮</span><span className="hole-name">Family</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑯</span><span className="hole-name">Volatility</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑰</span><span className="hole-name">Investing</span><span className="hole-status"></span></div>
              <div className="hole"><span className="hole-num">⑱</span><span className="hole-name">Clarity</span><span className="hole-status begun"></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
