import React from "react";
import "../../(content)/caddybook/caddybook.css";

export default function CaddyBookTOC() {
  return (
    <>
      <div className="doc-header">
        <span className="brand-left">Far Flung Change · the Caddy Book</span>
        <span className="brand-right">Forging Fog Into Focus</span>
      </div>
      <div className="toc-page">
        <p className="toc-eyebrow">
          <span className="toc-eyebrow-left">The Course:</span> ⑦ Essential Elements of Orientation
        </p>
        <ul className="toc-list">
          <li className="toc-item">
            <div className="toc-circle">1</div>
            <div className="toc-name">
              Position<span>where you are</span>
            </div>
            <div className="toc-fraction">① / ⑦</div>
          </li>
          <li className="toc-item">
            <div className="toc-circle">2</div>
            <div className="toc-name">
              Terrain<span>what surrounds you</span>
            </div>
            <div className="toc-fraction">② / ⑦</div>
          </li>
          <li className="toc-item">
            <div className="toc-circle">3</div>
            <div className="toc-name">
              Forces<span>what's acting on you</span>
            </div>
            <div className="toc-fraction">③ / ⑦</div>
          </li>
          <li className="toc-item">
            <div className="toc-circle">4</div>
            <div className="toc-name">
              Questions<span>what matters now</span>
            </div>
            <div className="toc-fraction">④ / ⑦</div>
          </li>
          <li className="toc-item">
            <div className="toc-circle">5</div>
            <div className="toc-name">
              Pace<span>where tempo ties in</span>
            </div>
            <div className="toc-fraction">⑤ / ⑦</div>
          </li>
          <li className="toc-item">
            <div className="toc-circle">6</div>
            <div className="toc-name">
              Options<span>how to scan for lines</span>
            </div>
            <div className="toc-fraction">⑥ / ⑦</div>
          </li>
          <li className="toc-item">
            <div className="toc-circle">7</div>
            <div className="toc-name">
              Readiness<span>when clarity compounds</span>
            </div>
            <div className="toc-fraction">⑦ / ⑦</div>
          </li>
        </ul>
        <p className="toc-begin">
          Each element has its own page. Space for notes included. Begin
        </p>
      </div>
    </>
  );
}
