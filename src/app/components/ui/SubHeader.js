import React from "react";
import Link from "next/link";

export default function SubHeader() {
  return (
    <div className="utility-bar">
      <Link href="/caddybook">CADDY BOOK</Link>
      <a href="/scorecard.pdf" target="_blank">SCORECARD</a>
      <Link href="/orientation/definitions">DOGSTAR DEFINITIONS</Link>
    </div>
  );
}
