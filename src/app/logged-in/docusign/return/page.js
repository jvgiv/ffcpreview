import Link from "next/link";

export const metadata = {
  title: "Signing Return | Far Flung Change",
};

export default function DocuSignReturnPage() {
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
          maxWidth: "38rem",
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
          Signing Session
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(3rem, 7vw, 4.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Return Received
        </h1>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.7)",
            lineHeight: "1.8",
            margin: "0 auto 2rem",
            maxWidth: "28rem",
          }}
        >
          DocuSign has returned control to your app. If this page is appearing inside the iframe,
          the signer never had to leave the site.
        </p>
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
          Start Another Session
        </Link>
      </section>
    </main>
  );
}
