"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import styles from "./SignedDocumentsPage.module.css";

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

function getStatusCopy(status) {
  switch (status) {
    case "signing_complete":
      return {
        label: "Signed",
        className: styles.badgeComplete,
      };
    case "viewing_complete":
      return {
        label: "Viewed",
        className: styles.badgePending,
      };
    case "cancel":
    case "cancelled":
      return {
        label: "Cancelled",
        className: styles.badgeCancelled,
      };
    case "recipient_view_created":
      return {
        label: "In Progress",
        className: styles.badgePending,
      };
    default:
      return {
        label: status.replace(/_/g, " ") || "Unknown",
        className: styles.badgePending,
      };
  }
}

function DocumentCard({ document, onViewDocument, isOpening }) {
  const statusCopy = getStatusCopy(document.status || document.lastSessionEvent || "unknown");

  return (
    <article className={styles.docCard}>
      <div className={styles.docTop}>
        <div>
          <h3 className={styles.docTitle}>{document.agreementTitle}</h3>
        </div>
        <span className={`${styles.badge} ${statusCopy.className}`}>{statusCopy.label}</span>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Envelope ID</span>
          <span className={styles.metaValue}>
            <span className={styles.inlineCode}>{document.envelopeId}</span>
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Signer</span>
          <span className={styles.metaValue}>{document.signer?.email || "Unknown signer"}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Signed At</span>
          <span className={styles.metaValue}>{formatDate(document.completedAt)}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Last Updated</span>
          <span className={styles.metaValue}>{formatDate(document.updatedAt)}</span>
        </div>
      </div>

      {document.isSigned ? (
        <div className={styles.docActions}>
          <button
            className={styles.inlineButton}
            type="button"
            onClick={() => onViewDocument(document)}
            disabled={isOpening}
          >
            {isOpening ? "Opening PDF..." : "View PDF"}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default function SignedDocumentsPage() {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeEnvelopeId, setActiveEnvelopeId] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthReady) {
      return undefined;
    }

    if (!authUser) {
      setDocuments([]);
      setIsLoading(false);
      setErrorMessage("Sign in to load the DocuSign documents connected to your account.");
      return undefined;
    }

    let isActive = true;

    async function loadDocuments() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const idToken = await authUser.getIdToken();
        const response = await fetch("/api/docusign/envelopes", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load your DocuSign documents.");
        }

        if (!isActive) {
          return;
        }

        setDocuments(Array.isArray(data.documents) ? data.documents : []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setErrorMessage(error.message || "Unable to load your DocuSign documents.");
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
  }, [authUser, isAuthReady]);

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
        `/api/docusign/envelopes/${encodeURIComponent(document.envelopeId)}/document`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to open the DocuSign document PDF.");
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
      setErrorMessage(error.message || "Unable to open the DocuSign document PDF.");
    } finally {
      setActiveEnvelopeId("");
    }
  }

  const signedDocuments = useMemo(
    () => documents.filter((document) => document.isSigned),
    [documents]
  );
  const recentActivity = useMemo(
    () => documents.filter((document) => !document.isSigned),
    [documents]
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>DocuSign History</span>
          <h1 className={styles.title}>Signed Documents</h1>
          <p className={styles.copy}>
            Review the DocuSign envelopes connected to your Firebase account. Completed signatures
            are separated from in-progress activity so users can quickly find what they have already
            signed.
          </p>
        </section>

        <section className={styles.stats}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Signed</span>
            <span className={styles.statValue}>{signedDocuments.length}</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Recent Activity</span>
            <span className={styles.statValue}>{recentActivity.length}</span>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Total Envelopes</span>
            <span className={styles.statValue}>{documents.length}</span>
          </article>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Signed</h2>
          <p className={styles.sectionCopy}>
            These are the envelopes currently marked as signed from the embedded DocuSign flow.
          </p>

          {isLoading ? <p className={styles.message}>Loading your DocuSign documents...</p> : null}
          {!isLoading && errorMessage ? (
            <p className={`${styles.message} ${styles.error}`}>{errorMessage}</p>
          ) : null}
          {!isLoading && !errorMessage && !signedDocuments.length ? (
            <p className={styles.message}>
              No signed documents are stored yet. Complete a DocuSign session and it will appear
              here.
            </p>
          ) : null}
          {!isLoading && !errorMessage && signedDocuments.length ? (
            <div className={styles.stack}>
              {signedDocuments.map((document) => (
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

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <p className={styles.sectionCopy}>
            Envelopes that have started but are not yet recorded as signed still show up here.
          </p>

          {!isLoading && !errorMessage && !recentActivity.length ? (
            <p className={styles.message}>No in-progress DocuSign activity is stored right now.</p>
          ) : null}
          {!isLoading && !errorMessage && recentActivity.length ? (
            <div className={styles.stack}>
              {recentActivity.map((document) => (
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

        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/logged-in/docusign">
            Start Another Signing Session
          </Link>
          <Link className={styles.secondaryButton} href="/logged-in">
            Back To Logged In
          </Link>
        </div>
      </div>
    </main>
  );
}
