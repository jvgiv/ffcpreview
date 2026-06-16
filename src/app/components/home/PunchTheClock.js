import React from "react";
import Link from "next/link";

export default function PunchTheClock() {
  return (
    <div className="final-cta" id="cta">
      <div className="container">
        <div className="reveal">
          <span className="section-label">Momentum Begins Here</span>
          <h2 className="section-title display">
            Punch
            <br />
            <span className="red">The <span style={{ color: "var(--red)"}}>Clock</span>.</span>
          </h2>
          <p>
            Your round is not over. Yet. <br />
            <span style={{ fontWeight: "bold", color: "var(--red)" }}>
              BE
            </span>{" "}
            <span style={{ color: "var(--white)" }}>
              Oriented. For Growin&apos;Up&apos;s Sake.{" "}
            </span>
            <br />
            Try Far Flung Change. Before you reach the Clubhouse.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/#pricing"
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "1.1rem 2.5rem" }}
            >
              Enroll Today
            </Link>
            <Link
              href="/#scorecard"
              className="btn-ghost"
              style={{ fontSize: "0.85rem", padding: "1.1rem 2.5rem" }}
            >
              Free ScoreCard First
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
