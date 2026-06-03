import React from "react";
import Link from "next/link";
import Image from "next/image";
import ScoreCardLightbox from "../ScoreCardLightbox";

const images = [
  { src: "/front9.png", alt: "Scorecard Front", width: 900, height: 2250, key: 1 },
  { src: "/back9.png", alt: "Scorecard Back", width: 900, height: 2250, key: 2 },
];

export default function NewScorecard() {
  return (
    <div className="scorecard" id="scorecard">
      <div className="container">
        <div className="scorecard-inner">
          <div className="scorecard-copy reveal">
            <span className="section-label">Start Here - Free</span>
            <h2 className="section-title">Your Orientation ScoreCard</h2>
            <p>
              Establish your baseline across 18 essential areas of financial
              life, from Cash Flow to Investing.
            </p>
            <p>
              Think of it as your course map before the round begins. Unlock it
              for free. Keep it forever. Use it to map exactly where you stand.
            </p>
            <Link
              href="/logged-in"
              className="btn-ghost"
              style={{ marginTop: "1rem", display: "inline-block" }}
            >
              Unlock ScoreCard -&gt;
            </Link>
          </div>
          <div
            className="scorecard-visual reveal"
            style={{ transitionDelay: "0.15s" }}
          >
            <p>Click to view or download</p>
            <ScoreCardLightbox images={images} />
          </div>
        </div>
      </div>
    </div>
  );
}
