import React from 'react'
import "./problem.css"
import "../../homepage.css"

export default function Problem() {
  return (
    <section id="problem" className="friction">
      <div className="container">
        <div className="friction-grid">
          <div className="friction-copy reveal">
            <span className="section-label">THE PROBLEM</span>
            <h2 className="section-title">YOU ARE DECIDING WITHOUT A MAP.</h2>
            <p>
              We are each born capable. But almost no one ever gets a clear overview of the
              financial terrain before they are expected to navigate it.
            </p>
            <p>
              So you proceed anyway because <strong>life does not wait.</strong> You sign
              documents that feel almost clear. You accept explanations that feel close
              enough. Fog isn&apos;t failure. Fog is normal. Steps are heavy when you can&apos;t see the field. That&apos;s not a personal flaw. It&apos;s a visibility problem.
            </p>
            <ul className="pain-list">
              <li>
                <span className="pain-num">01</span>
                Signing agreements you do not fully understand
              </li>
              <li>
                <span className="pain-num">02</span>
                Making major commitments without knowing the trade-offs
              </li>
              <li>
                <span className="pain-num">03</span>
                Sensing there is more to know but not knowing where to start
              </li>
            </ul>
          </div>

          <div className="friction-stat reveal">
            <div className="stat-item">
              <p className="stat-num">
                88
                <span>%</span>
              </p>
              <p className="stat-label">
                of Americans say high school did not leave them fully prepared for handling money in the real world.
              </p>
              <div className="stat-divider" />
              <p className="stat-num">23<span>%</span></p>
              <p className="stat-label">
                of Americans say their income would be sufficient if they understood how to manage it more effectively. <br /> Another 19% indicate their financial situation is best described by <i>both – my income is limited and I struggle with money management.</i>
              </p>
              <div className="stat-divider" />
              <p className="stat-num">
                $388 <span>BILLION</span>
              </p>
              <p className="stat-label">The estimated cost of financial illiteracy in the United States in 2023.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
