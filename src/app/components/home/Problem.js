import React from "react";
import "../../homepage.css";

export default function Problem() {
  return (
    <section id="problem" className="friction">
      <div className="container">
        <div className="friction-grid">
          <div className="friction-copy reveal">
            <span className="section-label">THE PROBLEM</span>
            {/* <h2 className="section-title">YOU ARE DECIDING WITHOUT A MAP.</h2> */}
            <h2 className="section-title">
              MONEY MATTERS ARE <span style={{ color: "var(--red)"}}>MURKY</span>. FINANCE FEELS <span style={{ color: "var(--red)"}}>FOREIGN</span>.
            </h2>

            <p>Most people feel the pressure. Very few say it out loud.</p>

            {/* <p>
              We are each born capable. But almost no one ever gets a clear overview of the
              financial terrain before they are expected to navigate it.
            </p> */}
            <p>
              You&apos;ve made major decisions about debt, taxes, insurance, and
              retirement. Some felt right. Some felt rushed. Most felt like a
              guess made in a language you never quite learned.</p>
              <p> It&apos;s not a
              lack of intelligence. It&apos;s a lack of vocabulary.
            </p>
            <p>
              You don&apos;t need to be an expert to make the most of your
              money. But you should be oriented.  For Growin&apos;Up&apos;s Sake.
            </p>
            {/* <p>
              That&apos;s the gap.
            </p> */}
            {/* <p>
              So you proceed anyway because <strong>life does not wait.</strong> You sign
              documents that feel almost clear. You accept explanations that feel close
              enough. Fog isn&apos;t failure. Fog is normal. Steps are heavy when you can&apos;t see the field. That&apos;s not a personal flaw. It&apos;s a visibility problem.
            </p> */}
            <ul className="pain-list">
              <li>
                <span className="pain-num">01</span>
                You&apos;ve signed agreements you didn&apos;t fully understand
              </li>
              <li>
                <span className="pain-num">02</span>
                You&apos;ve made major commitments without knowing the
                trade-offs
              </li>
              <li>
                <span className="pain-num">03</span>
                You&apos;ve sensed there&apos;s more to know but had no idea
                where to start
              </li>
            </ul>
            {/* <p>
              That feeling has a name:{" "}
              <span style={{ color: "var(--red)" }}>FINANCIAL FOG.</span> And
              it&apos;s more common than the statistics will ever fully capture.
            </p> */}
          </div>

          <div className="friction-stat reveal">
            <div className="stat-item">
              <div className="stat-block stat-block-top">
                <p className="stat-num">
                  88 <span>PERCENT</span>
                </p>
                <p className="stat-label">
                  of Americans say high school did not leave them fully prepared
                  for handling money in the real world.
                </p>
                <div className="stat-divider" />
              </div>
              <div className="stat-block stat-block-middle">
                <p className="stat-num">
                  1,506 <span>DOLLARS</span>
                </p>
                <p className="stat-label">
                  is the estimated amount that financial illiteracy cost the average American in 2023.
                  {/* <br /> Another 19% indicate their financial situation is best described by <i>both – my income is limited and I struggle with money management.</i> */}
                </p>
                <div className="stat-divider" />
              </div>
              <div className="stat-block stat-block-bottom">
                <p className="stat-num">
                  388 <span>BILLION</span>
                </p>
                <p className="stat-label">
                  is the estimated cost of financial illiteracy in the United
                  States in 2023.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
