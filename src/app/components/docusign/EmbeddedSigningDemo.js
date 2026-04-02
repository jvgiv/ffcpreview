"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import styles from "./EmbeddedSigningDemo.module.css";
import { AGREEMENT_DEFINITIONS } from "@/lib/agreements";

const EMPTY_STATUS = {
  type: "",
  text: "",
};

const FOCUSED_VIEW_MOUNT_ID = "docusign-focused-view";

function getSessionEndType(event) {
  if (typeof event === "string") {
    return event;
  }

  return event?.sessionEndType || event?.event || event?.type || "session_end";
}

function buildSigningCompleteUrl(baseUrl, envelopeId, sessionEndType) {
  const url = new URL(baseUrl || "/signing-complete", window.location.origin);
  url.searchParams.set("envelopeId", envelopeId);
  url.searchParams.set("event", sessionEndType);
  return url.toString();
}

const AGREEMENT_OPTIONS = Object.values(AGREEMENT_DEFINITIONS);

export default function EmbeddedSigningDemo({ initialAgreementSlug }) {
  const [config, setConfig] = useState(null);
  const [formData, setFormData] = useState({
    signerName: "",
    signerEmail: "",
    agreementSlug: AGREEMENT_DEFINITIONS[initialAgreementSlug]
      ? initialAgreementSlug
      : AGREEMENT_OPTIONS[0]?.slug || "",
  });
  const [authUser, setAuthUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(EMPTY_STATUS);
  const [recipientViewUrl, setRecipientViewUrl] = useState("");
  const [envelopeId, setEnvelopeId] = useState("");
  const [isDocuSignJsReady, setIsDocuSignJsReady] = useState(false);
  const [docuSignJsError, setDocuSignJsError] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsAuthReady(true);
      setFormData((current) => ({
        ...current,
        signerName: current.signerName || user?.displayName || "",
        signerEmail: current.signerEmail || user?.email || "",
      }));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const response = await fetch("/api/docusign/config", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setConfig(data);
        setFormData((current) => ({
          ...current,
          signerName: current.signerName || data.defaultSignerName || "",
          signerEmail: current.signerEmail || data.defaultSignerEmail || "",
        }));
      } catch {
        if (!isMounted) {
          return;
        }

        setConfig({
          ready: false,
          missing: [],
          firestoreAdminReady: false,
          firestoreAdminMissing: [],
        });
        setStatus({
          type: "error",
          text: "Unable to load the DocuSign configuration status from the server.",
        });
      } finally {
        if (isMounted) {
          setIsLoadingConfig(false);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!config?.ready || !config.jsBundleUrl || !config.publicIntegrationKey) {
      return undefined;
    }

    if (window.DocuSign) {
      setIsDocuSignJsReady(true);
      setDocuSignJsError("");
      return undefined;
    }

    let isActive = true;
    const existingScript = document.querySelector(
      `script[data-docusign-js="${config.jsBundleUrl}"]`
    );

    function handleLoad() {
      if (!isActive) {
        return;
      }

      setIsDocuSignJsReady(true);
      setDocuSignJsError("");
    }

    function handleError() {
      if (!isActive) {
        return;
      }

      setDocuSignJsError(
        "DocuSign focused view could not be loaded. Reload the page or use a public tunnel for local development."
      );
    }

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      if (window.DocuSign) {
        handleLoad();
      }

      return () => {
        isActive = false;
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.src = config.jsBundleUrl;
    script.async = true;
    script.dataset.docusignJs = config.jsBundleUrl;
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.body.appendChild(script);

    return () => {
      isActive = false;
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [config]);

  async function getAuthorizedHeaders() {
    if (!authUser) {
      throw new Error("Please sign in again before starting a DocuSign session.");
    }

    const idToken = await authUser.getIdToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    };
  }

  const persistEnvelopeEvent = useEffectEvent(async (sessionEndType) => {
    if (!authUser || !envelopeId) {
      return false;
    }

    try {
      const response = await fetch(`/api/docusign/envelopes/${encodeURIComponent(envelopeId)}`, {
        method: "PATCH",
        headers: await getAuthorizedHeaders(),
        body: JSON.stringify({
          sessionEndType,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("DocuSign envelope event persistence failed", error);
      return false;
    }
  });

  useEffect(() => {
    if (
      !recipientViewUrl ||
      !isDocuSignJsReady ||
      !config?.publicIntegrationKey ||
      !envelopeId
    ) {
      return undefined;
    }

    let isActive = true;

    async function mountFocusedView() {
      try {
        const mountNode = document.getElementById(FOCUSED_VIEW_MOUNT_ID);

        if (!mountNode) {
          return;
        }

        mountNode.innerHTML = "";

        const docusign = await window.DocuSign.loadDocuSign(config.publicIntegrationKey);

        if (!isActive) {
          return;
        }

        const signing = docusign.signing({
          url: recipientViewUrl,
          displayFormat: "focused",
        });

        signing.on("sessionEnd", (event) => {
          const endType = getSessionEndType(event);

          if (endType === "signing_complete" || endType === "viewing_complete") {
            void (async () => {
              await persistEnvelopeEvent(endType);
              window.location.assign(
                buildSigningCompleteUrl(config.signingReturnUrl, envelopeId, endType)
              );
            })();
            return;
          }

          void (async () => {
            const stored = await persistEnvelopeEvent(endType);

            if (!isActive) {
              return;
            }

            setRecipientViewUrl("");
            setStatus({
              type: endType === "cancel" ? "error" : "success",
              text: stored
                ? `Signing session ended: ${endType.replace(/_/g, " ")}. Firestore was updated with the latest session event.`
                : `Signing session ended: ${endType.replace(/_/g, " ")}. Firestore update did not complete, so check server logs.`,
            });
          })();
        });

        await signing.mount(`#${FOCUSED_VIEW_MOUNT_ID}`);

        if (!isActive) {
          return;
        }

        setStatus({
          type: "success",
          text: "DocuSign focused view is active. Envelope metadata is being stored in Firestore.",
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setDocuSignJsError(
          error?.message ||
            "DocuSign focused view could not start. A public localhost tunnel is the safest fallback for local testing."
        );
      }
    }

    mountFocusedView();

    return () => {
      isActive = false;
      const mountNode = document.getElementById(FOCUSED_VIEW_MOUNT_ID);

      if (mountNode) {
        mountNode.innerHTML = "";
      }
    };
  }, [config, envelopeId, isDocuSignJsReady, recipientViewUrl]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(EMPTY_STATUS);
    setRecipientViewUrl("");
    setEnvelopeId("");

    try {
      const response = await fetch("/api/docusign/embedded-signing", {
        method: "POST",
        headers: await getAuthorizedHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.consentRequired && data.consentUrl) {
          setStatus({
            type: "error",
            text: "DocuSign still needs one-time JWT consent. Use the consent link below, accept access, then come back and start signing again.",
          });
          setConfig((current) => ({
            ...(current || {}),
            consentUrl: data.consentUrl,
          }));
          return;
        }

        throw new Error(data.error || "Unable to start the DocuSign signing session.");
      }

      setRecipientViewUrl(data.recipientViewUrl);
      setEnvelopeId(data.envelopeId);
      setStatus({
        type: "success",
        text: isDocuSignJsReady
          ? "Embedded signing session created. Firestore metadata was stored and focused view is loading now."
          : "Embedded signing session created. Firestore metadata was stored and the DocuSign focused view library is loading now.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: error.message || "Unable to start the DocuSign signing session.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const canStartSigning =
    Boolean(config?.ready) &&
    Boolean(config?.firestoreAdminReady) &&
    isAuthReady &&
    Boolean(authUser) &&
    Boolean(formData.agreementSlug);

  const selectedAgreement = AGREEMENT_DEFINITIONS[formData.agreementSlug];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Embedded Signing</span>
          <h1 className={styles.title}>DocuSign In-Site Scaffold</h1>
          <p className={styles.copy}>
            Start the agreement that matches the package the user selected, open DocuSign focused
            view, and store envelope metadata in Firestore when the session starts and ends.
          </p>
        </section>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Setup</h2>
            <p className={styles.sectionCopy}>
              Keep the private key on the server only. The runtime does not need your RSA public key
              because DocuSign already stores that for JWT verification.
            </p>

            {isLoadingConfig ? (
              <p className={styles.message}>Checking DocuSign and Firestore configuration...</p>
            ) : config?.ready ? (
              <div className={styles.iframeShell}>
                <p className={`${styles.message} ${styles.success}`}>
                  DocuSign server configuration looks ready for the scaffold.
                </p>
                <p className={styles.smallMeta}>
                  Environment: <span className={styles.inlineCode}>{config.environment}</span>
                </p>
              </div>
            ) : (
              <div className={styles.iframeShell}>
                <p className={`${styles.message} ${styles.error}`}>
                  DocuSign is not configured yet. Fill the missing env values and restart the dev
                  server.
                </p>
                <ul className={styles.statusList}>
                  {(config?.missing || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {!isLoadingConfig && config?.ready && !config?.firestoreAdminReady ? (
              <div className={styles.iframeShell}>
                <p className={`${styles.message} ${styles.error}`}>
                  Firestore server writes are not configured yet. Add Firebase Admin credentials
                  before starting embedded signing.
                </p>
                <ul className={styles.statusList}>
                  {(config?.firestoreAdminMissing || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!isAuthReady ? (
              <p className={styles.message}>Confirming your Firebase session...</p>
            ) : !authUser ? (
              <p className={`${styles.message} ${styles.error}`}>
                Sign in with Firebase before starting a DocuSign session so the envelope can be tied
                to your Firestore user record.
              </p>
            ) : null}

            {config?.consentUrl ? (
              <div className={styles.actions}>
                <a
                  className={styles.secondaryButton}
                  href={config.consentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Consent Screen
                </a>
              </div>
            ) : null}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="signerName">
                  Signer Name
                </label>
                <input
                  id="signerName"
                  className={styles.input}
                  name="signerName"
                  type="text"
                  value={formData.signerName}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="signerEmail">
                  Signer Email
                </label>
                <input
                  id="signerEmail"
                  className={styles.input}
                  name="signerEmail"
                  type="email"
                  value={formData.signerEmail}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="agreementSlug">
                  Agreement
                </label>
                <select
                  id="agreementSlug"
                  className={styles.input}
                  name="agreementSlug"
                  value={formData.agreementSlug}
                  onChange={handleChange}
                  required
                >
                  {AGREEMENT_OPTIONS.map((agreement) => (
                    <option key={agreement.slug} value={agreement.slug}>
                      {agreement.packageName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAgreement ? (
                <p className={styles.smallMeta}>
                  Sending: <span className={styles.inlineCode}>{selectedAgreement.agreementTitle}</span>
                </p>
              ) : null}

              {status.text ? (
                <p
                  className={`${styles.message} ${
                    status.type === "error" ? styles.error : styles.success
                  }`}
                >
                  {status.text}
                </p>
              ) : null}

              {docuSignJsError ? (
                <p className={`${styles.message} ${styles.error}`}>{docuSignJsError}</p>
              ) : null}

              <div className={styles.actions}>
                <button
                  className={styles.primaryButton}
                  type="submit"
                  disabled={isSubmitting || !canStartSigning}
                >
                  {isSubmitting ? "Starting Session..." : "Start Embedded Signing"}
                </button>
                {selectedAgreement ? (
                  <Link
                    className={styles.textLink}
                    href={`/agreements/${selectedAgreement.slug}`}
                  >
                    Review Agreement
                  </Link>
                ) : null}
                <Link className={styles.textLink} href="/logged-in">
                  Back To Logged In
                </Link>
              </div>
            </form>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Signer View</h2>
            <p className={styles.sectionCopy}>
              Firestore documents are written to a top-level DocuSign envelope collection and a
              per-user subcollection so you can list envelopes globally or by Firebase user.
            </p>

            {recipientViewUrl ? (
              <div className={styles.iframeShell}>
                <p className={styles.smallMeta}>
                  Envelope ID: <span className={styles.inlineCode}>{envelopeId}</span>
                </p>
                {!isDocuSignJsReady ? (
                  <p className={styles.message}>Loading DocuSign focused view...</p>
                ) : null}
                <div id={FOCUSED_VIEW_MOUNT_ID} className={styles.focusedViewMount} />
                <p className={styles.smallMeta}>
                  If focused view cannot load locally, test through an HTTPS tunnel such as ngrok or
                  Cloudflare Tunnel so both the app and DocuSign return URL stay on a public origin.
                </p>
              </div>
            ) : (
              <p className={styles.message}>
                Start a session and the embedded DocuSign signing screen will render here.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


