import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8rem 1.5rem 4rem",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, rgba(231, 76, 60, 0.16), transparent 24rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "46rem",
          border: "1px solid rgba(245, 240, 232, 0.12)",
          background: "rgba(10, 10, 10, 0.9)",
          padding: "clamp(1.5rem, 3vw, 3rem)",
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
          Lost The Map
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(3rem, 8vw, 5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.72)",
            lineHeight: "1.9",
            maxWidth: "32rem",
            margin: "0 auto 2rem",
          }}
        >
          The page you were looking for does not exist, may have moved, or may not be available
          from this route.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.85rem",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
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
            Back Home
          </Link>
          <Link
            href="/agreements"
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
            View Agreements
          </Link>
        </div>
      </section>
    </main>
  );
}
