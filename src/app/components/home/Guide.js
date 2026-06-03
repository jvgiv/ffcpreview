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
            You don&apos;t need another product. You need a bearing.
          </h2>
          <p>
            Far Flung Change provides practical financial{" "}
            <span style={{ fontWeight: "bold" }}>orientation.</span> No hidden
            agendas. No asset management.
            <br />
            <br />
            Think of it as behind-the-wheel driver&apos;s ed - the fundamental
            training you get before navigating rush hour or steering through a
            heavy fog. Information tells you the weather. Orientation tells you
            how to drive through it.
            <br />
            <br />
            Information helps. But without orientation, it&apos;s harder to know
            what <span style={{ fontWeight: "bold" }}>matters</span>, what{" "}
            <span style={{ fontWeight: "bold" }}>connects</span>, and where to{" "}
            <span style={{ fontWeight: "bold" }}>begin</span>.
            <br />
            <br />
            This is your 12-month baseline. We don&apos;t manage your money. We
            help you master it&apos;s vocabulary. We don&apos;t take the wheel.
            We illuminate the map.
            <br />
            {/* <br />
            Not manage it for you. Understand it.
            <br />
            <span style={{ color: "var(--red)", fontWeight: "bold" }}>
              Far Flung Change
            </span>{" "}
            helps you{" "}
            <span style={{ fontWeight: "bold" }}>find your bearings</span>. */}
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
        <br />
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
              Master core concepts, definitions, and trade-offs. Delivered
              plainly - completely stripped of products, pitches, or pressure.
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
              Submit your real-world questions anytime. Get fiduciary-level
              clarity via phone, Zoom, or face-to-face. Zero sales agenda.
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
                Evaluate advice, products, and market noise intelligently. Build
                the confidence that only comes from true
                understanding.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
