"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { getDb } from "@/lib/firebase/firestore";

export default function LoggedInPage() {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setDisplayName("");
        return;
      }

      if (user.displayName) {
        setDisplayName(user.displayName);
        return;
      }

      try {
        const userSnapshot = await getDoc(doc(getDb(), "users", user.uid));
        const firestoreName = userSnapshot.data()?.displayName;
        setDisplayName(firestoreName || user.email || "friend");
      } catch {
        setDisplayName(user.email || "friend");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "8rem 1.5rem 4rem",
        background:
          "radial-gradient(circle at top, rgba(231, 76, 60, 0.18), transparent 24rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "46rem",
          border: "1px solid rgba(245, 240, 232, 0.12)",
          background: "rgba(10, 10, 10, 0.88)",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--red-hot)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Login Complete
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(3rem, 7vw, 5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Hey you logged in!
        </h1>
        <p
          style={{
            color: "var(--white)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          {displayName ? `Welcome, ${displayName}` : "Welcome"}
        </p>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.68)",
            lineHeight: "1.8",
            maxWidth: "31rem",
            margin: "0 auto 1.25rem",
          }}
        >
          Your sign-in was successful and your account is ready to use.
        </p>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.68)",
            lineHeight: "1.8",
            maxWidth: "31rem",
            margin: "0 auto 2rem",
          }}
        >
          You can launch a DocuSign embedded-signing session or open your signed-documents history
          to review what has already been stored in Firestore for your account.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.85rem",
            justifyContent: "center",
          }}
        >
          <a
            href="/files/CaddyBook.pdf"
            download
            style={{
              display: "inline-block",
              padding: "0.95rem 1.25rem",
              border: "1px solid var(--red)",
              background: "var(--red)",
              color: "var(--white)",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Get your Free Caddy Book + ScoreCard
          </a>
          <Link
            href="/logged-in/docusign"
            style={{
              display: "inline-block",
              padding: "0.95rem 1.25rem",
              border: "1px solid var(--red)",
              background: "var(--red)",
              color: "var(--white)",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Open DocuSign Demo
          </Link>
          <Link
            href="/logged-in/documents"
            style={{
              display: "inline-block",
              padding: "0.95rem 1.25rem",
              border: "1px solid rgba(245, 240, 232, 0.18)",
              background: "transparent",
              color: "var(--white)",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            View Signed Documents
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.95rem 1.25rem",
              border: "1px solid rgba(245, 240, 232, 0.18)",
              background: "transparent",
              color: "var(--white)",
              textDecoration: "none",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
