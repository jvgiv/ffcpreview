import React from "react";

export default function BelowLogo() {
  return (
    <section className="below-logo" aria-label="Guided Orientation overview">
      <div className="below-logo-panel below-logo-benefits">
        <span className="below-logo-eyebrow">WHAT DO YOU GET WITH</span>
        <h2 className="below-logo-title">GUIDED ORIENTATION?</h2>
        <h3 style={{ color: "var(--gray)" }}>
          EVERYTHING YOU NEED
          <br />
          TO FORGE FOG INTO <span style={{ color: "var(--white)" }}>FOCUS</span>
          <br /> and nothing you don&apos;t
        </h3>
        <div className="below-logo-list">
        <div className="below-logo-item">
          <h1>
            <span style={{ color: "var(--red)", fontSize: "1rem" }}>01</span>{" "}
            YOUR <span style={{ color: "var(--red)" }}>TREASURE</span> MAP
          </h1>
          <p>
            Your facts and your perspective, brought together in a clear,
            personal polaroid showing where you stand
          </p>
        </div>
        <div className="below-logo-item">
          <h1>
            <span style={{ color: "var(--red)", fontSize: "1rem" }}>02</span>{" "}
            YOUR <span style={{ color: "var(--red)" }}>FIELD</span> GUIDE
          </h1>
          <p>
            650+ terms described plainly with practical field notes. No jargon
            and no guessing what things mean.
          </p>
        </div>
        <div className="below-logo-item">
          <h1>
            <span style={{ color: "var(--red)", fontSize: "1rem" }}>03</span>{" "}
            YOUR <span style={{ color: "var(--red)" }}>DIRECT</span> LINE
          </h1>
          <p>
            Unlimited fiduciary-level answers as real questions arise, for one
            full year. And with no sales agenda attached.
          </p>
        </div>
        </div>
      </div>

      <div className="below-logo-panel below-logo-process">
        <span className="below-logo-eyebrow" style={{ color: "var(--red)" }}>
          THE <span style={{ color: "var(--white)" }}>[</span>SIMPLE
          <span style={{ color: "var(--white)" }}>]</span> PROCESS
        </span>
        <h2 className="below-logo-title">HOW ORIENTATION WORKS</h2>
        <p className="how-p-text">Financial Orientation comes in two phases.</p>
        <p className="how-p-text">The first gets you moving.</p>
        <p className="how-p-text">The second keeps you going.</p>
        <div className="below-logo-phase">
          <h1>
            <span style={{ color: "var(--red)", fontSize: "1rem" }}>01</span>{" "}
            GETTING STARTED
          </h1>
          <div className="below-logo-step">
            <h2>
              <span style={{ color: "var(--red)" }}>S</span>URVEY YOUR TERRAIN
            </h2>
            <p className="how-p-text">
              we gather facts together, so nothing about your finances remains
              unknown
            </p>
          </div>
          <div className="below-logo-step">
            <h2>
              <span style={{ color: "var(--red)" }}>I</span>DENTIFY YOUR
              POSITION
            </h2>
            <p className="how-p-text">
              see where you stand with the Caddy Book of Orientation
            </p>
          </div>
          <div className="below-logo-step">
            <h2>
              <span style={{ color: "var(--red)" }}>M</span>AP YOUR ASSETS
            </h2>
            <p className="how-p-text">
              your figures and your perspective together on your own treasure
              map
            </p>
          </div>
        </div>

        <div className="below-logo-phase">
          <h1>
            <span style={{ color: "var(--red)", fontSize: "1rem" }}>02</span>{" "}
            MOVING FORWARD
          </h1>
          <div className="below-logo-step">
            <h2>
              <span style={{ color: "var(--red)" }}>P</span>ACE YOUR PROGRESS
            </h2>
            <p className="how-p-text">
              orientation unfolds over a year, not an afternoon, so nothing is
              rushed
            </p>
          </div>
          <div className="below-logo-step">
            <h2>
              <span style={{ color: "var(--red)" }}>L</span>EVERAGE YOUR
              LEARNING
            </h2>
            <p className="how-p-text">
              each question you ask and get answered sharpens your clarity and
              judgment
            </p>
          </div>
          <div className="below-logo-step">
            <h2>
              <span style={{ color: "var(--red)" }}>E</span>XPAND YOUR POTENTIAL
            </h2>
            <p className="how-p-text">
              see the clarity turn into confident, deliberate decision-making
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
