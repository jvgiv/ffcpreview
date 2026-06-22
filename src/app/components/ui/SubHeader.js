'use client'
import React from "react";
import Link from "next/link";
import { useAuth } from "../auth/AuthProvider";

export default function SubHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="utility-bar">
      {isAuthenticated ? (
        <Link className="utility-links" href="/caddybook">
          CADDY BOOK
        </Link>
      ) : (
        <a className="utility-links" href="/files/CaddyBook.pdf" target="_blank">
          CADDY BOOK
        </a>
      )}
      <a className="utility-links" href="/scorecard.pdf" target="_blank">
        SCORECARD
      </a>
      <Link
        className="utility-links third-link"
        href="/orientation/definitions"
      >
        DOGSTAR DEFINITIONS
      </Link>
    </div>
  );
}
