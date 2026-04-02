import React from "react";
import Link from "next/link";
import "../../(content)/definitions/definitions.css";

export default function HomePageDefs() {
  return (
    <div className="defs-homepage" id="definitions-preview">
      <div className="container">
        <div className="scorecard-inner">
          <div
            className="definitions-visual reveal"
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="hole-grid-defs">
              <div className="entry-layout">
                <div className="entry-header fade-up">
                  <div id="entryNum" className="entry-num">
                    14
                  </div>
                  <div id="entryWord" className="entry-word">
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
                <div id="entryDef" className="entry-def fade-up">
                  The difference between what comes in and what goes out. Simple
                  arithmetic. Profound consequence. When the gap is positive:
                  you have something to work with. When it is negative:
                  everything else is noise. When it is zero: you are running,
                  not building.
                  <div style={{ height: "0.75rem" }} />
                  But the gap is more than a number. It is the hinge, the
                  moment of now between then1 and then2: between the financial
                  life already lived and the financial life still possible.
                  Then1 is fixed. Then2 is not yet written. The gap is where you
                  stand between them, and the only place any act of financial
                  liberty is ever actually available. Find your gap. Widen it.
                  Then decide what it is for.
                </div>
                <div id="entryNoteWrap" className="entry-note fade-up">
                  <div id="entryNoteLabel" className="entry-note-label">
                    Field Note:
                  </div>
                  <div id="entryNote" className="entry-note-text">
                    The gap is not what is left over. It is what you were
                    working toward. | see: Surplus; Deficit; Savings Rate
                    (Savings 6); Investing (Investing 14)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="scorecard-copy reveal">
            <span className="section-label">Dogstar Definitions</span>
            <h2 className="section-title">Your Financial Orientation Dictionary</h2>
            <p>
              The Dogstar Definitions are your personal field guide through 18
              essential areas of financial life from Accounts and Cash Flow to
              Investing and Clarity.
            </p>
            <p>
              Think of it as your go to resource for understanding financial
              concepts.
            </p>
            <Link
              href="/definitions"
              className="btn-ghost"
              style={{ marginTop: "1rem", display: "inline-block" }}
            >
              Unlock Dogstar Definitions -
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
