import Link from "next/link";
import { getPurchaseBySlug, listPurchases } from "@/lib/purchases";

export const metadata = {
  title: "Payment Complete | Far Flung Change",
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const purchase =
    getPurchaseBySlug(resolvedSearchParams?.agreement) || listPurchases()[0] || null;
  const orderId =
    typeof resolvedSearchParams?.orderId === "string"
      ? resolvedSearchParams.orderId
      : "";

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
          maxWidth: "44rem",
          border: "1px solid rgba(245, 240, 232, 0.12)",
          background: "rgba(10, 10, 10, 0.88)",
          padding: "3rem 2rem",
          textAlign: "center",
          display: "grid",
          gap: "1rem",
        }}
      >
        <p
          style={{
            color: "var(--red-hot)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Payment Complete
        </p>
        <h1
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(3rem, 7vw, 4.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {purchase?.successTitle || "Checkout Complete"}
        </h1>
        <p
          style={{
            color: "rgba(245, 240, 232, 0.72)",
            lineHeight: 1.8,
            margin: "0 auto",
            maxWidth: "30rem",
          }}
        >
          Your agreement has been signed and your PayPal payment has been captured for{" "}
          <strong style={{ color: "var(--white)" }}>
            {purchase?.displayName || "this package"}
          </strong>
          .
        </p>
        {orderId ? (
          <p
            style={{
              margin: 0,
              color: "rgba(245, 240, 232, 0.65)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.78rem",
              wordBreak: "break-word",
            }}
          >
            Order ID: {orderId}
          </p>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.85rem",
            justifyContent: "center",
            marginTop: "0.75rem",
          }}
        >
          <Link
            href="/logged-in"
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
            Back To Member Home
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
        </div>
      </section>
    </main>
  );
}
