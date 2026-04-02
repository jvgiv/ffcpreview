import React from 'react'
import "../../homepage.css"

export default function Program() {
  return (
    <div id="solution" className="guide">
      
        <div className="container">
            <div className="guide-intro reveal visible">
            <span className="section-label">The Guide</span>
            <h2 className="section-title">You do not need another product. You need a starting point.</h2>
            <p>Far Flung Change is not financial advice. It is not management or implementation. It is <strong style={{color:"var(--white)"}}>orientation</strong> — the kind of on-the-ground training in the cockpit that you should have had before anyone asked you to fly.</p>
            </div>
            <div className="guide-cards reveal visible" style={{transitionDelay:"0.1s"}}>
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

