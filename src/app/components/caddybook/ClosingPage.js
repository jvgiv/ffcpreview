import React from "react";
import "../../(content)/caddybook/caddybook.css";

export default function ClosingPage({ handleSubmit }) {
  return (
    <>
      <div className="doc-header">
        <span className="brand-left">Far Flung Change · the Caddy Book</span>
        <span className="brand-right">Forging Fog Into Focus</span>
      </div>
      <div className="closing-page">
        <p className="closing-top">What To Do Next</p>
        <h2>What This Means</h2>
        <div className="closing-block">
          <p>
            You've just done something most people never do. You've looked at
            your financial life with honest eyes and identified where
            orientation is needed most. That alone puts you ahead of where you
            were when you picked this up.
          </p>
        </div>
        <div className="closing-block">
          <p className="cl-label">If you want to go further on your own:</p>
          <p>
            Keep this. Come back to it. The questions you wrote in your notes
            are worth sitting with. Share it with someone who matters to your
            financial life: a partner, a family member, a friend who's been
            asking the same questions. There are no wrong answers here and no
            expiration date on the work you've started.
          </p>
        </div>
        <div className="closing-block">
          <p className="cl-label">If you want a guide for the next part:</p>
          <p>
            That's exactly what Far Flung Change was built for. A conversation,
            not a sales pitch to manage your money for you. Orientation first.
            Always. We listen before we speak and we never hand you a map before
            you know where you're standing.
          </p>
        </div>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginTop: '8px' }}>
          You can always find us standing at:{" "}
          <a
            className="closing-cta"
            href="https://FarFlungChange.com"
            target="_blank"
          >
            FarFlungChange.com
          </a>
        </p>
        <p className="disclaimer">
          Investment Advisory Services offered through First Financial Advisory
          Services, Inc., a Registered Investment Advisor. Securities offered
          through Cetera Advisors, LLC, member FINRA/SIPC. Cetera is under
          separate ownership from any other named entity.
        </p>
      </div>

      <div className="momentum-bar">
        <div className="mb-label">Momentum</div>
        <div className="mb-main">Begins Here</div>
        <div className="mb-divider"></div>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Your Caddybook <span className="submit-arrow">&#8594;</span>
        </button>
      </div>
    </>
  );
}
