import React from 'react'
import "../../homepage.css"

export default function Guide() {
  return (
    <div className="guide" id="solution">
        <div className="container">
            <div className="guide-intro reveal">
            <span className="section-label">The Solution</span>
            <h2 className="section-title">You don&apos;t need another product. You need a starting point.</h2>
            <p>Far Flung Change isn&apos;t financial advice. It isn&apos;t management or implementation. It&apos;s <strong style={{color: "var(--white)"}}>orientation</strong> — the kind of on-the-ground training in the cockpit that you should&apos;ve had before anyone asked you to fly.  Information helps. Just not before orientation. Without a reference point, nothing you learn has anywhere to land. It just adds to the noise.  Because information helps.  Just not before orientation.  Without a reference point, nothing you learn has anywhere to land. It just adds to the noise.</p>
            </div>
            {/* <div className="guide-cards reveal" style={{transitionDelay: "0.1s"}}> */}
            <div className="guide-cards" style={{transitionDelay: "0.1s"}}>
            <div className="guide-card">
                <div className="card-icon">🗺</div>
                <div className="card-title">Learn the Terrain</div>
                <div className="card-body">Core financial concepts, vocabulary, and trade-offs — delivered in plain language, without products or pitches attached.</div>
            </div>
            <div className="guide-card">
                <div className="card-icon">💬</div>
                <div className="card-title">Ask Real Questions</div>
                <div className="card-body">Submit your actual questions anytime. Get fiduciary-level responses by phone, Zoom, or in person. No sales agenda.</div>
            </div>
            <div className="guide-card">
                <div className="card-icon">🧭</div>
                <div className="card-title">Move Forward Clearly</div>
                <div className="card-body">Evaluate advice, products, and decisions intelligently — with the confidence that comes from genuine understanding.</div>
            </div>
            </div>
        </div>
    </div>
      
    
  )
}
