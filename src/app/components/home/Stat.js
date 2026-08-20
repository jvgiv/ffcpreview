import React from "react";
import "../../homepage.css";

export default function Stat() {
  return (
    <div className="friction-stat reveal">
      <div className="stat-item">
        <div className="stat-block stat-block-top">
          <h2 className="stat-title-home">
            WHAT THE <span style={{ color: "var(--red)" }}>NUMBERS</span> SAY
          </h2>
          <p className="stat-num">
            98:2 <span>ODDS</span>
          </p>
          <p className="stat-label">
            the chance you&apos;re navigating money matters and making choices
            without confidence
          </p>
        </div>
        <div className="stat-block stat-block-middle">
          <p className="stat-num">
            X² <span>YEARS</span>
          </p>
          <p className="stat-label">
            there&apos;s no telling how many years confusion will cost you since
            it compounds indefinitely
          </p>
          {/* <div className="stat-divider" /> */}
        </div>
        <div className="stat-block stat-block-bottom">
          <p className="stat-num">
            100% <span>CERTAINTY</span>
          </p>
          <p className="stat-label">
            that you&apos;ve never been offered a simple way to gain basic
            fluency in money matters
            <br />
            until now
          </p>
        </div>
      </div>
    </div>
  );
}
