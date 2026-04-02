import React from 'react'
import '../../(content)/caddybook/caddybook.css'
import Image from 'next/image'

export default function CaddyBookCover() {
  return (
    <div className="cover">
        <div className="cover-logo">
            <Image
                src='/ffc-dark.svg'
                alt="FFC Logo"
                width={150}
                height={150}
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
