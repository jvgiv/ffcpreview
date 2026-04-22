import React from 'react'
import '../../(content)/caddybook/caddybook.css'
import Image from 'next/image'

export default function CaddyBookCover({ memberProfile }) {
  const hasMemberProfile = Boolean(
    memberProfile?.displayName || memberProfile?.zipCode || memberProfile?.ageRange
  )

  return (
    <div className="cover">
        <div className="cover-logo">
            <Image
                src='/FFLogo.png'
                alt="FFC Logo"
                fill
                sizes="(max-width: 580px) 120px, (max-width: 900px) 150px, 180px"
                className="cover-logo-image"
                style={{ objectFit: 'contain', objectPosition: 'center 46%' }}
            />
        </div>
        <div className="cover-mid">
            <p className="cover-eyebrow">· A Practical Field Guide · Identify Where You Are Now ·</p>
            <div className="cover-rule"></div>
            <p className="cover-caddy">the Caddy Book of</p>
            <h1 className="cover-title">Orientation</h1>
            <p className="cover-tagline">Seven Elements &nbsp;·&nbsp; Plain Language &nbsp;·&nbsp; Your Notes</p>
            <p className="cover-sub">before you proceed : scout the course</p>
            <div className="cover-rule2"></div>
            <div className="cover-stats">
            <div className="cover-stat"><span className="stat-num"><span className="circled">7</span></span>Essential<br />Elements</div>
            <div className="cover-stat"><span className="stat-num"><span className="circled">10</span></span>Minutes<br />to Complete</div>
            <div className="cover-stat"><span className="stat-num"><span className="circled">0</span></span>Wrong<br />Answers</div>
            <div className="cover-stat"><span className="stat-num"><span className="circled">0</span></span>$ Cost<br />Keep or Share</div>
            </div>
            {hasMemberProfile ? (
              <div className="cover-member-card">
                <span className="cover-member-label">Prepared for</span>
                <div className="cover-member-grid">
                  <div className="cover-member-item">
                    <span className="cover-member-key">Name</span>
                    <span className="cover-member-value">
                      {memberProfile.displayName || 'Not provided'}
                    </span>
                  </div>
                  <div className="cover-member-item">
                    <span className="cover-member-key">Zip</span>
                    <span className="cover-member-value">
                      {memberProfile.zipCode || 'Not provided'}
                    </span>
                  </div>
                  <div className="cover-member-item">
                    <span className="cover-member-key">Age Range</span>
                    <span className="cover-member-value">
                      {memberProfile.ageRange || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
        </div>
        <div className="cover-bottom">
            <div className="cover-brand">
            <div className="brand-name">FarFlungChange.com</div>
            <div className="brand-sub">Forging Fog Into Focus</div>
            </div>
            <div className="cover-getready">
              <div className="cover-getready-logo" aria-hidden="true">
                <Image
                  src='/ffc-dark.svg'
                  alt=""
                  width={110}
                  height={110}
                />
              </div>
              <div className="cover-getready-text">
                <span className="get">GET</span>
                <span className="ready">READY</span>
              </div>
            </div>
        </div>
    </div>
  )
}
