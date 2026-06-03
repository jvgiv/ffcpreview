import React from "react";
import Link from "next/link";
import "../../(content)/orientation/definitions/definitions.css";

export default function HomePageDefs() {
  return (
    <div className="defs-homepage" id="definitions-preview">
      <div className="container">
        <div className="scorecard-inner defs-homepage-inner">
          <div className="scorecard-copy defs-homepage-copy reveal">
            <span className="section-label">DogStar Definitions</span>
            <h2 className="section-title">Your Financial Field Guide</h2>
            <p>
              Stop guessing at terms designed to confuse you. This is your
              personal field guide:{" "}
              <span style={{ fontStyle: "italic" }}>
                360 proprietary definitions
              </span>{" "}
              mapping out the 18 essential areas of your financial life, from
              Cash Flow to Investing.
            </p>{" "}
            <p>
              Need a deeper dive? You also get{" "}
              <span style={{ fontWeight: "bold" }}>6 specialized</span>{" "}
              supplements uncovering 293 more advanced terms. It&apos;s not just
              a glossary. It&apos;s your master key to decoding the financial
              language.
            </p>
            <Link
              href="/orientation/definitions"
              className="btn-ghost"
              style={{ marginTop: "1rem", display: "inline-block" }}
            >
              Unlock the Field Guide -&gt;
            </Link>
          </div>
          <div
            className="definitions-visual defs-homepage-preview reveal"
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="hole-grid-defs">
              <div className="entry-layout">
                <div className="entry-header fade-up">
                  <div id="entryNum" className="entry-num-home">
                    14
                  </div>
                  <div id="entryWord" className="entry-word-home">
                    THE GAP
                  </div>
                  <div className="entry-meta">
                    <span id="entryPron" className="entry-pron">
                      /the gap/
                    </span>
                    <span id="entryPos" className="entry-pos">
                      concept
                    </span>
                  </div>
                </div>
                <div className="entry-divider"></div>
                <div id="entryDef" className="entry-def fade-up defs-entry-def">
                  <p>
                    The difference between what comes in and what goes out.
                    Simple arithmetic. Profound consequence. When the gap is
                    positive: you have something to work with. When it is
                    negative: everything else is noise. When it is zero: you are
                    running, not building.
                  </p>
                  <p>
                    But the gap is more than a number. It is the hinge, the
                    moment of now between Then<sup>1</sup> and Then<sup>2</sup>:
                    between the financial life already lived and the financial
                    life still possible.</p>
                    <p>Then<sup>1</sup> is fixed. Then
                    <sup>2</sup> is not yet written. The gap is where you stand
                    between them, and the only place any act of financial
                    liberty is ever actually available. Find your gap. Widen it.
                    Then decide what it is for.
                  </p>
                </div>
                <div id="entryNoteWrap" className="entry-note-home fade-up">
                  <div id="entryNoteLabel" className="entry-note-label-home">
                    Field Note:
                  </div>
                  <div id="entryNote" className="entry-note-text-home">
                    The gap is not what is left over. It is what you were
                    working toward. | see: Surplus; Deficit; Savings Rate
                    (Savings 6); Investing (Investing 14)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
