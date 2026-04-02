import Link from "next/link";

export const metadata = {
  title: "DocuSign Consent Callback | Far Flung Change",
};

export default function DocuSignCallbackPage() {
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
          maxWidth: "40rem",
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
          DocuSign Consent
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
          Callback Received
        </h1>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.7)",
            lineHeight: "1.8",
            margin: "0 auto 2rem",
            maxWidth: "28rem",
          }}
        >
          This page is the registered DocuSign OAuth consent callback. After you accept consent,
          head back to the embedded-signing demo and start the session again.
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
          Return To DocuSign Demo
        </Link>
      </section>
    </main>
  );
}
