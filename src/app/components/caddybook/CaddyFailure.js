import React from 'react'
import Link from 'next/link'
import '../../(content)/caddybook/caddybook.css'

export default function CaddyFailure({ onRetrySubmit }) {
  return (
    <>
      <div className="doc-header">
        <span className="brand-left">Far Flung Change · the Caddy Book</span>
        <span className="brand-right">Forging Fog Into Focus</span>
      </div>
      <div className="failure-page">
        <p className="failure-top">Submission Interrupted</p>
        <h2>Something Went Wrong</h2>
        <div className="failure-block">
          <p>
            Your caddybook could not be submitted successfully this time.
            Please try again in a moment. If the issue continues, reach out and
            we&apos;ll help you finish the process directly.
          </p>
        </div>
        <div className="failure-block">
          <p className="failure-label">Next step</p>
          <p>
            Return to the caddybook flow to resubmit, or head home if you need
            to pause and come back with a clearer signal.
          </p>
        </div>
        <div className="failure-actions">
          <Link
            href="#"
            className="failure-link"
            onClick={(event) => {
              event.preventDefault()
              onRetrySubmit?.()
            }}
          >
            Try Submitting Again
          </Link>
          <Link href="/" className="failure-link">
            Return Home
          </Link>
        </div>
      </div>
    </>
  )
}
