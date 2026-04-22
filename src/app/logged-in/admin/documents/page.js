"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";

function formatDate(value) {
  if (!value) {
    return "Not available yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatCard({ label, value }) {
  return (
    <article
      style={{
        border: "1px solid rgba(245, 240, 232, 0.12)",
        background: "rgba(10, 10, 10, 0.88)",
        padding: "1.25rem",
      }}
    >
      <span
        style={{
          display: "block",
          color: "rgba(245, 240, 232, 0.64)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: "block",
          color: "var(--white)",
          fontFamily: "var(--font-bebas-neue), sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {value}
      </span>
    </article>
  );
}

function DocumentCard({ document, onViewDocument, isOpening }) {
  return (
    <article
      style={{
        border: "1px solid rgba(245, 240, 232, 0.12)",
        background: "rgba(12, 12, 12, 0.9)",
        padding: "1.2rem",
        display: "grid",
        gap: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "0.85rem",
          alignItems: "start",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "var(--white)", fontSize: "1.15rem" }}>
            {document.agreementTitle}
          </h3>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: "rgba(245, 240, 232, 0.65)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.78rem",
            }}
          >
            Envelope {document.envelopeId}
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "2rem",
            padding: "0.35rem 0.75rem",
            border: "1px solid rgba(148, 187, 91, 0.36)",
            background: "rgba(148, 187, 91, 0.12)",
            color: "#eef8dd",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Signed
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.7rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div style={{ display: "grid", gap: "0.15rem" }}>
          <span style={{ color: "rgba(245, 240, 232, 0.55)", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Signer</span>
          <span style={{ color: "rgba(245, 240, 232, 0.88)", lineHeight: 1.6 }}>{document.signer?.name || document.signer?.email || "Unknown signer"}</span>
        </div>
        <div style={{ display: "grid", gap: "0.15rem" }}>
          <span style={{ color: "rgba(245, 240, 232, 0.55)", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Signer Email</span>
          <span style={{ color: "rgba(245, 240, 232, 0.88)", lineHeight: 1.6, wordBreak: "break-word" }}>{document.signer?.email || "Unknown"}</span>
        </div>
        <div style={{ display: "grid", gap: "0.15rem" }}>
          <span style={{ color: "rgba(245, 240, 232, 0.55)", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Requested By</span>
          <span style={{ color: "rgba(245, 240, 232, 0.88)", lineHeight: 1.6 }}>{document.requestedBy?.email || document.requestedBy?.name || "Unknown"}</span>
        </div>
        <div style={{ display: "grid", gap: "0.15rem" }}>
          <span style={{ color: "rgba(245, 240, 232, 0.55)", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Signed At</span>
          <span style={{ color: "rgba(245, 240, 232, 0.88)", lineHeight: 1.6 }}>{formatDate(document.completedAt)}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
        <button
          type="button"
          onClick={() => onViewDocument(document)}
          disabled={isOpening}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "3rem",
            padding: "0.85rem 1.2rem",
            border: "1px solid rgba(245, 240, 232, 0.2)",
            background: "transparent",
            color: "var(--white)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: isOpening ? "wait" : "pointer",
            opacity: isOpening ? 0.65 : 1,
          }}
        >
          {isOpening ? "Opening PDF..." : "View PDF"}
        </button>
      </div>
    </article>
  );
}

export default function AdminSignedDocumentsPage() {
  const { authUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeEnvelopeId, setActiveEnvelopeId] = useState("");

  useEffect(() => {
    if (!authUser) {
      return undefined;
    }

    let isActive = true;

    async function loadDocuments() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const idToken = await authUser.getIdToken();
        const response = await fetch("/api/admin/docusign/signed", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load signed DocuSign documents.");
        }

        if (!isActive) {
          return;
        }

        setDocuments(Array.isArray(data.documents) ? data.documents : []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(error.message || "Unable to load signed DocuSign documents.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDocuments();

    return () => {
      isActive = false;
    };
  }, [authUser]);

  async function handleViewDocument(document) {
    if (!authUser) {
      setErrorMessage("Sign in again before opening a DocuSign document.");
      return;
    }

    setActiveEnvelopeId(document.envelopeId);
    setErrorMessage("");

    try {
      const idToken = await authUser.getIdToken();
      const response = await fetch(
        `/api/admin/docusign/signed/${encodeURIComponent(document.envelopeId)}/document`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to open the signed DocuSign PDF.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const newWindow = window.open(objectUrl, "_blank", "noopener,noreferrer");

      if (!newWindow) {
        window.location.assign(objectUrl);
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);
    } catch (error) {
      setErrorMessage(error.message || "Unable to open the signed DocuSign PDF.");
    } finally {
      setActiveEnvelopeId("");
    }
  }

  const recentSignerCount = useMemo(
    () => new Set(documents.map((document) => document.signer?.email).filter(Boolean)).size,
    [documents]
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8.5rem 1.25rem 4rem",
        background:
          "radial-gradient(circle at top, rgba(206, 66, 43, 0.15), transparent 28rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
      }}
    >
      <div style={{ width: "min(1120px, 100%)", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
        <section
          style={{
            border: "1px solid rgba(245, 240, 232, 0.12)",
            background: "rgba(10, 10, 10, 0.88)",
            padding: "clamp(1.5rem, 3vw, 2.4rem)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "var(--red-hot)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
            }}
          >
            Admin DocuSign View
          </span>
          <h1
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(2.9rem, 6vw, 4.8rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 0.75rem",
            }}
          >
            All Signed Documents
          </h1>
          <p style={{ maxWidth: "50rem", color: "rgba(245, 240, 232, 0.75)", lineHeight: 1.8, margin: 0 }}>
            Review every signed DocuSign envelope stored in the top-level Firestore collection and open the combined PDF for any completed record.
          </p>
        </section>

        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <StatCard label="Signed Docs" value={isLoading ? "..." : documents.length} />
          <StatCard label="Unique Signers" value={isLoading ? "..." : recentSignerCount} />
        </section>

        <section
          style={{
            border: "1px solid rgba(245, 240, 232, 0.12)",
            background: "rgba(10, 10, 10, 0.88)",
            padding: "clamp(1.5rem, 3vw, 2.4rem)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginBottom: "1.25rem" }}>
            <Link
              href="/logged-in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "3rem",
                padding: "0.85rem 1.2rem",
                border: "1px solid rgba(245, 240, 232, 0.2)",
                background: "transparent",
                color: "var(--white)",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Back To Admin Home
            </Link>
          </div>

          {isLoading ? (
            <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.85)", lineHeight: 1.7 }}>
              Loading signed DocuSign documents...
            </p>
          ) : null}
          {!isLoading && errorMessage ? (
            <p style={{ margin: 0, color: "#ffd8cf", lineHeight: 1.7 }}>{errorMessage}</p>
          ) : null}
          {!isLoading && !errorMessage && !documents.length ? (
            <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.85)", lineHeight: 1.7 }}>
              No signed DocuSign documents are stored yet.
            </p>
          ) : null}
          {!isLoading && !errorMessage && documents.length ? (
            <div style={{ display: "grid", gap: "1rem" }}>
              {documents.map((document) => (
                <DocumentCard
                  key={document.envelopeId}
                  document={document}
                  onViewDocument={handleViewDocument}
                  isOpening={activeEnvelopeId === document.envelopeId}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}