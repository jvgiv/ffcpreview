import React from 'react'

export default function Quote() {
  return (
    <div className="creed">
    <div className="container">
        <blockquote className="reveal">
        &quot;Orientation brings clarity. <br /> Clarity builds confidence.&quot;
        </blockquote>
        <div className="creed-bar reveal" style={{transitionDelay: '0.1s'}}>
        <span className="creed-tag">Fiduciary</span>
        <span className="creed-tag">No Products</span>
        <span className="creed-tag">No Pressure</span>
        <span className="creed-tag">No Pitches</span>
        <span className="creed-tag">Est. 1974</span>
        </div>
    </div>
</div>
  )
}
