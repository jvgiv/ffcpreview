import React from 'react'
import Link from 'next/link'
import '../../(content)/caddybook/caddybook.css'

export default function CaddySuccess() {
  return (
    <>
      <div className="doc-header">
        <span className="brand-left">Far Flung Change · the Caddy Book</span>
        <span className="brand-right">Forging Fog Into Focus</span>
      </div>
      <div className="success-page">
        <p className="success-top">Submission Received</p>
        <h2>Thank You</h2>
        <div className="success-block">
          <p>
            Your caddybook responses have been received. We&apos;ll be in touch
            within 24 to 48 hours with next steps and any follow-up that would
            help sharpen your orientation.
          </p>
        </div>
        <div className="success-block">
          <p className="success-label">While you wait</p>
          <p>
            You can return home or keep exploring the language behind the work
            through the DogStar Definitions.
          </p>
        </div>
        <div className="success-actions">
          <Link href="/" className="success-link">
            Return Home
          </Link>
          <Link href="/definitions" className="success-link">
            Explore DogStar Definitions
          </Link>
        </div>
      </div>
    </>
  )
}
