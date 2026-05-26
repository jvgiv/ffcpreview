import React from "react";
import "../../homepage.css";
import Image from "next/image";

export default function Guide() {
  return (
    <div className="guide" id="solution">
      <div className="container">
        <div className="guide-intro reveal">
          <span className="section-label">The Solution</span>
          <h2 className="section-title">
            You don&apos;t need another product. You need a starting point.
          </h2>
          <p>
            Far Flung Change providespractical financial{" "}
            <span style={{ fontWeight: "bold" }}>orientation.</span>  Nothing else.
            <br />
            <br />
            The kind of behind-the-wheel driver&apos;s education you had long
            before you ever considered navigating rush hour, taking a road trip,
            or driving through fog.
            <br />
            <br />
            Information helps. But without orientation, it&apos;s harder to know
            what <span style={{ fontWeight: "bold" }}>matters</span>, what{" "}
            <span style={{ fontWeight: "bold" }}>connects</span>, and where to{" "}
            <span style={{ fontWeight: "bold" }}>begin</span>.
            <br />
            <br />
            Practical Financial Orientation is your starting point.  A 12-month program with
            one goal: helping you better understand your financial life.
            <br />
            <br />
            Not manage it for you. Understand it.
            <br />
            <span style={{ color: "var(--red)", fontWeight: "bold" }}>
              Far Flung Change
            </span>{" "}
            helps you{" "}
            <span style={{ fontWeight: "bold" }}>find your bearings</span>.
            {/* It isn&apos;t
            management or implementation. It&apos;s{" "}
            <strong style={{ color: "var(--white)" }}>orientation</strong> — the
            kind of on-the-ground training in the cockpit that you
            should&apos;ve had before anyone asked you to fly. Information
            helps. Just not before orientation. Without a reference point,
            nothing you learn has anywhere to land. It just adds to the noise.
            Because information helps. Just not before orientation. Without a
            reference point, nothing you learn has anywhere to land. It just
            adds to the noise. */}
          </p>
        </div>
        {/* <div className="guide-cards reveal" style={{transitionDelay: "0.1s"}}> */}
        <div className="guide-cards" style={{ transitionDelay: "0.1s" }}>
          <div className="guide-card">
            <div className="card-icon">
              <Image
                src="/svg/eye.svg"
                alt="eyeball"
                width={60}
                height={60}
                style={{ marginLeft: "0.5rem" }}
              />
            </div>
            <div className="card-title">Learn the Terrain</div>
            <div className="card-body">
              Grasp core financial concepts, vocabulary, and trade-offs delivered
              plainly, without products or pitches attached.
            </div>
          </div>
          <div className="guide-card">
            <div className="card-icon">
              <Image
                src="/svg/mag.svg"
                alt="magnifying glass"
                width={60}
                height={60}
                style={{ marginLeft: "0.5rem" }}
              />
            </div>
            <div className="card-title">Ask Real Questions</div>
            <div className="card-body">
              Submit your actual questions anytime. Get fiduciary-level
              responses by phone, Zoom, or in person. No sales agenda.
            </div>
          </div>
          <div className="guide-card">
            <div className="card-icon">
              <Image
                src="/svg/chair.svg"
                alt="crosshair"
                width={60}
                height={60}
                style={{ marginLeft: "0.5rem" }}
              />
            </div>
            <div className="card-title">
              <span style={{ color: "#d91f2c" }}>Move Forward Clearly</span>
            </div>
            <div className="card-body">
              <span style={{ color: "var(--white)" }}>
                Evaluate advice, products, and decisions intelligently — with
                the confidence that comes from genuine understanding.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
