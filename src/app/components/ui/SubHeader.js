import React from "react";
import Link from "next/link";

export default function SubHeader() {
  return (
    <div className="utility-bar">
      <Link className="utility-links" href="/caddybook" target="_blank">CADDY BOOK</Link>
      <a className="utility-links" href="/scorecard.pdf" target="_blank">SCORECARD</a>
      <Link className="utility-links third-link" href="/orientation/definitions">DOGSTAR DEFINITIONS</Link>
    </div>
  );
}
