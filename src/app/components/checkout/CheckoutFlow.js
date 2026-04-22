"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { formatPaymentStatus, listPurchases } from "@/lib/purchases";

const EMPTY_MESSAGE = {
  type: "",
  text: "",
};

const PURCHASE_OPTIONS = listPurchases();
const FOCUSED_VIEW_MOUNT_ID = "checkout-docusign-focused-view";
const PAYPAL_BUTTON_MOUNT_ID = "checkout-paypal-button-mount";

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

function getSessionEndType(event) {
  if (typeof event === "string") {
    return event;
  }

  return event?.sessionEndType || event?.event || event?.type || "session_end";
}

function buildPayPalSdkUrl(clientId) {
  const params = new URLSearchParams({
    "client-id": clientId,
    currency: "USD",
    intent: "capture",
    components: "buttons",
  });

  return `https://www.paypal.com/sdk/js?${params.toString()}`;
}

function MessageBanner({ message }) {
  if (!message?.text) {
    return null;
  }

  const isError = message.type === "error";

  return (
    <p
      style={{
        margin: 0,
        padding: "0.95rem 1rem",
        border: isError
          ? "1px solid rgba(206, 66, 43, 0.45)"
          : "1px solid rgba(148, 187, 91, 0.4)",
        background: isError ? "rgba(206, 66, 43, 0.12)" : "rgba(148, 187, 91, 0.12)",
        color: isError ? "#ffd8cf" : "#eef8dd",
        lineHeight: 1.7,
      }}
    >
      {message.text}
    </p>
  );
}

function StepCard({ eyebrow, title, copy, statusLabel, statusTone = "default", children }) {
  const statusColors =
    statusTone === "success"
      ? {
          border: "1px solid rgba(148, 187, 91, 0.36)",
          background: "rgba(148, 187, 91, 0.12)",
          color: "#eef8dd",
        }
      : statusTone === "error"
        ? {
            border: "1px solid rgba(206, 66, 43, 0.45)",
            background: "rgba(206, 66, 43, 0.12)",
            color: "#ffd8cf",
          }
        : {
            border: "1px solid rgba(245, 240, 232, 0.16)",
            background: "rgba(245, 240, 232, 0.06)",
            color: "rgba(245, 240, 232, 0.9)",
          };

  return (
    <section
      style={{
        border: "1px solid rgba(245, 240, 232, 0.12)",
        background: "rgba(10, 10, 10, 0.88)",
        padding: "clamp(1.4rem, 3vw, 2rem)",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: "0.45rem" }}>
          <span
            style={{
              display: "inline-block",
              color: "var(--red-hot)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h2>
          <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.74)", lineHeight: 1.8 }}>
            {copy}
          </p>
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "2rem",
            padding: "0.35rem 0.75rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            ...statusColors,
          }}
        >
          {statusLabel}
        </span>
      </div>

      {children}
    </section>
  );
}

function PackageOption({ purchase, isActive }) {
  return (
    <Link
      href={`/logged-in/checkout?agreement=${purchase.agreementSlug}`}
      style={{
        display: "grid",
        gap: "0.3rem",
        minWidth: "220px",
        padding: "1rem 1.1rem",
        textDecoration: "none",
        border: isActive
          ? "1px solid rgba(206, 66, 43, 0.6)"
          : "1px solid rgba(245, 240, 232, 0.14)",
        background: isActive ? "rgba(206, 66, 43, 0.16)" : "rgba(255, 255, 255, 0.03)",
        color: "var(--white)",
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: isActive ? "#ffd8cf" : "rgba(245, 240, 232, 0.6)",
        }}
      >
        Package
      </span>
      <strong style={{ fontSize: "1rem", lineHeight: 1.4 }}>{purchase.displayName}</strong>
      <span style={{ color: "rgba(245, 240, 232, 0.78)" }}>{purchase.priceLabel}</span>
    </Link>
  );
}

export default function CheckoutFlow({ initialAgreementSlug }) {
  const router = useRouter();
  const { authUser, profile, isLoading: isAuthLoading } = useAuth();
  const selectedPurchase =
    PURCHASE_OPTIONS.find((purchase) => purchase.agreementSlug === initialAgreementSlug) ||
    PURCHASE_OPTIONS[0] ||
    null;
  const [checkoutState, setCheckoutState] = useState({
    isLoading: true,
    errorMessage: "",
    purchase: selectedPurchase,
    agreement: null,
    signing: {
      isSigned: false,
      envelopeId: "",
      status: "",
      completedAt: null,
    },
    payment: {
      status: "",
      isPaid: false,
      lastOrderId: "",
      payerEmail: "",
      completedAt: null,
    },
  });
  const [docuSignConfig, setDocuSignConfig] = useState(null);
  const [isLoadingDocuSignConfig, setIsLoadingDocuSignConfig] = useState(true);
  const [signingForm, setSigningForm] = useState({
    signerName: "",
    signerEmail: "",
  });
  const [isStartingSigning, setIsStartingSigning] = useState(false);
  const [recipientViewUrl, setRecipientViewUrl] = useState("");
  const [envelopeId, setEnvelopeId] = useState("");
  const [isDocuSignJsReady, setIsDocuSignJsReady] = useState(false);
  const [docuSignJsError, setDocuSignJsError] = useState("");
  const [signingMessage, setSigningMessage] = useState(EMPTY_MESSAGE);
  const [paymentMessage, setPaymentMessage] = useState(EMPTY_MESSAGE);
  const [isPayPalScriptReady, setIsPayPalScriptReady] = useState(false);
  const [payPalError, setPayPalError] = useState("");
  const [isCapturingPayment, setIsCapturingPayment] = useState(false);

  const payPalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  useEffect(() => {
    setCheckoutState((currentState) => ({
      ...currentState,
      isLoading: true,
      errorMessage: "",
      purchase: selectedPurchase,
    }));
    setRecipientViewUrl("");
    setEnvelopeId("");
    setSigningMessage(EMPTY_MESSAGE);
    setPaymentMessage(EMPTY_MESSAGE);
    setDocuSignJsError("");
    setPayPalError("");
  }, [selectedPurchase]);

  useEffect(() => {
    setSigningForm((currentForm) => ({
      signerName:
        currentForm.signerName ||
        profile?.displayName ||
        authUser?.displayName ||
        authUser?.email ||
        "",
      signerEmail: currentForm.signerEmail || profile?.email || authUser?.email || "",
    }));
  }, [authUser, profile]);

  const loadCheckoutState = useEffectEvent(async () => {
    if (!authUser || !selectedPurchase) {
      return;
    }

    try {
      const idToken = await authUser.getIdToken();
      const response = await fetch(
        `/api/checkout/${encodeURIComponent(selectedPurchase.agreementSlug)}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load the checkout state.");
      }

      setCheckoutState({
        isLoading: false,
        errorMessage: "",
        purchase: data.purchase || selectedPurchase,
        agreement: data.agreement || null,
        signing: {
          isSigned: Boolean(data.signing?.isSigned),
          envelopeId: data.signing?.envelopeId || "",
          status: data.signing?.status || "",
          completedAt: data.signing?.completedAt || null,
        },
        payment: {
          ...(data.payment || {}),
          status: data.payment?.status || "",
          isPaid: Boolean(data.payment?.isPaid),
          lastOrderId: data.payment?.lastOrderId || "",
          payerEmail: data.payment?.payerEmail || "",
          completedAt: data.payment?.completedAt || null,
        },
      });
    } catch (error) {
      setCheckoutState((currentState) => ({
        ...currentState,
        isLoading: false,
        errorMessage: error.message || "Unable to load the checkout state.",
      }));
    }
  });

  useEffect(() => {
    if (isAuthLoading || !authUser || !selectedPurchase) {
      return;
    }

    void loadCheckoutState();
  }, [authUser, isAuthLoading, selectedPurchase]);

  useEffect(() => {
    let isMounted = true;

    async function loadDocuSignConfig() {
      try {
        const response = await fetch("/api/docusign/config", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setDocuSignConfig(data);
      } catch {
        if (!isMounted) {
          return;
        }

        setDocuSignConfig({
          ready: false,
          missing: [],
          firestoreAdminReady: false,
          firestoreAdminMissing: [],
        });
      } finally {
        if (isMounted) {
          setIsLoadingDocuSignConfig(false);
        }
      }
    }

    loadDocuSignConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!docuSignConfig?.ready || !docuSignConfig.jsBundleUrl || !docuSignConfig.publicIntegrationKey) {
      return undefined;
    }

    if (window.DocuSign) {
      setIsDocuSignJsReady(true);
      setDocuSignJsError("");
      return undefined;
    }

    let isActive = true;
    const existingScript = document.querySelector(
      `script[data-docusign-js="${docuSignConfig.jsBundleUrl}"]`
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
        "DocuSign focused view could not be loaded. Reload the page or use a public tunnel for local testing."
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
    script.src = docuSignConfig.jsBundleUrl;
    script.async = true;
    script.dataset.docusignJs = docuSignConfig.jsBundleUrl;
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.body.appendChild(script);

    return () => {
      isActive = false;
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [docuSignConfig]);

  useEffect(() => {
    if (!payPalClientId) {
      return undefined;
    }

    const scriptUrl = buildPayPalSdkUrl(payPalClientId);

    if (window.paypal) {
      setIsPayPalScriptReady(true);
      setPayPalError("");
      return undefined;
    }

    let isActive = true;
    const existingScript = document.querySelector(`script[data-paypal-sdk="${scriptUrl}"]`);

    function handleLoad() {
      if (!isActive) {
        return;
      }

      setIsPayPalScriptReady(true);
      setPayPalError("");
    }

    function handleError() {
      if (!isActive) {
        return;
      }

      setPayPalError("PayPal could not be loaded for this page.");
    }

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      if (window.paypal) {
        handleLoad();
      }

      return () => {
        isActive = false;
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.dataset.paypalSdk = scriptUrl;
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.body.appendChild(script);

    return () => {
      isActive = false;
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [payPalClientId]);

  async function getAuthorizedHeaders() {
    if (!authUser) {
      throw new Error("Sign in again before continuing checkout.");
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
      console.error("DocuSign envelope persistence failed", error);
      return false;
    }
  });

  useEffect(() => {
    if (
      !recipientViewUrl ||
      !isDocuSignJsReady ||
      !docuSignConfig?.publicIntegrationKey ||
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

        const docusign = await window.DocuSign.loadDocuSign(docuSignConfig.publicIntegrationKey);

        if (!isActive) {
          return;
        }

        const signing = docusign.signing({
          url: recipientViewUrl,
          displayFormat: "focused",
        });

        signing.on("sessionEnd", (event) => {
          const endType = getSessionEndType(event);

          void (async () => {
            const stored = await persistEnvelopeEvent(endType);

            if (!isActive) {
              return;
            }

            setRecipientViewUrl("");

            if (endType === "signing_complete" && stored) {
              setCheckoutState((currentState) => ({
                ...currentState,
                signing: {
                  isSigned: true,
                  envelopeId,
                  status: endType,
                  completedAt: new Date().toISOString(),
                },
                payment: {
                  ...currentState.payment,
                  isPaid: Boolean(currentState.payment?.isPaid),
                },
              }));
              setSigningMessage({
                type: "success",
                text: "Agreement signed and saved. Payment is now unlocked below.",
              });
              return;
            }

            if (endType === "viewing_complete") {
              setSigningMessage({
                type: stored ? "success" : "error",
                text: stored
                  ? "The agreement session ended after review. Finish the signature to unlock payment."
                  : "The review session ended, but the latest event could not be saved. Refresh before continuing.",
              });
              return;
            }

            setSigningMessage({
              type: "error",
              text: stored
                ? `Signing session ended: ${endType.replace(/_/g, " ")}.`
                : `Signing session ended: ${endType.replace(/_/g, " ")}. The latest event could not be saved, so refresh before trying again.`,
            });
          })();
        });

        await signing.mount(`#${FOCUSED_VIEW_MOUNT_ID}`);

        if (!isActive) {
          return;
        }

        setSigningMessage({
          type: "success",
          text: "DocuSign focused view is active. Complete the agreement to unlock payment.",
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
  }, [docuSignConfig, envelopeId, isDocuSignJsReady, recipientViewUrl]);

  const selectedEnvelopeId = envelopeId || checkoutState.signing.envelopeId || "";
  const isPaymentUnlocked = checkoutState.signing.isSigned && !checkoutState.payment.isPaid;
  const showPayPalMount =
    Boolean(selectedPurchase) &&
    Boolean(authUser) &&
    isPaymentUnlocked &&
    Boolean(selectedEnvelopeId) &&
    Boolean(payPalClientId);

  const renderPayPalButtons = useEffectEvent(async () => {
    if (!showPayPalMount || !window.paypal || !selectedPurchase) {
      return;
    }

    const mountNode = document.getElementById(PAYPAL_BUTTON_MOUNT_ID);

    if (!mountNode) {
      return;
    }

    mountNode.innerHTML = "";

    const buttons = window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
      },
      createOrder: async () => {
        setPaymentMessage(EMPTY_MESSAGE);
        const response = await fetch("/api/paypal/orders", {
          method: "POST",
          headers: await getAuthorizedHeaders(),
          body: JSON.stringify({
            agreementSlug: selectedPurchase.agreementSlug,
            envelopeId: selectedEnvelopeId,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to create the PayPal order.");
        }

        return data.orderId;
      },
      onApprove: async (data) => {
        setIsCapturingPayment(true);
        setPaymentMessage({
          type: "success",
          text: "Approval received. Capturing your PayPal payment now...",
        });

        try {
          const response = await fetch(
            `/api/paypal/orders/${encodeURIComponent(data.orderID)}/capture`,
            {
              method: "POST",
              headers: await getAuthorizedHeaders(),
            }
          );
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Unable to capture the PayPal payment.");
          }

          setCheckoutState((currentState) => ({
            ...currentState,
            payment: {
              ...currentState.payment,
              status: "paid",
              isPaid: true,
              lastOrderId: data.orderID,
              payerEmail: result.payerEmail || currentState.payment?.payerEmail || "",
              completedAt: new Date().toISOString(),
            },
          }));
          router.push(
            `/logged-in/checkout/success?agreement=${selectedPurchase.agreementSlug}&orderId=${encodeURIComponent(
              data.orderID
            )}`
          );
          router.refresh();
        } catch (error) {
          setPaymentMessage({
            type: "error",
            text: error.message || "Unable to capture the PayPal payment.",
          });
        } finally {
          setIsCapturingPayment(false);
        }
      },
      onCancel: () => {
        setPaymentMessage({
          type: "error",
          text: "PayPal checkout was closed before the payment was completed.",
        });
      },
      onError: (error) => {
        setPaymentMessage({
          type: "error",
          text: error?.message || "PayPal could not complete the checkout flow.",
        });
      },
    });

    if (!buttons.isEligible()) {
      setPayPalError("PayPal checkout is not eligible in this browser or account context.");
      return;
    }

    await buttons.render(`#${PAYPAL_BUTTON_MOUNT_ID}`);
  });

  useEffect(() => {
    if (!isPayPalScriptReady || !showPayPalMount) {
      const mountNode = document.getElementById(PAYPAL_BUTTON_MOUNT_ID);

      if (mountNode) {
        mountNode.innerHTML = "";
      }

      return undefined;
    }

    void renderPayPalButtons();

    return () => {
      const mountNode = document.getElementById(PAYPAL_BUTTON_MOUNT_ID);

      if (mountNode) {
        mountNode.innerHTML = "";
      }
    };
  }, [
    isPayPalScriptReady,
    selectedEnvelopeId,
    selectedPurchase,
    showPayPalMount,
  ]);

  function handleSigningInputChange(event) {
    const { name, value } = event.target;
    setSigningForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleStartSigning(event) {
    event.preventDefault();

    if (!selectedPurchase) {
      return;
    }

    setIsStartingSigning(true);
    setSigningMessage(EMPTY_MESSAGE);
    setRecipientViewUrl("");
    setEnvelopeId("");

    try {
      const response = await fetch("/api/docusign/embedded-signing", {
        method: "POST",
        headers: await getAuthorizedHeaders(),
        body: JSON.stringify({
          signerName: signingForm.signerName.trim(),
          signerEmail: signingForm.signerEmail.trim(),
          agreementSlug: selectedPurchase.agreementSlug,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.consentRequired && data.consentUrl) {
          setSigningMessage({
            type: "error",
            text: "DocuSign still needs one-time JWT consent. Use the consent link below, accept access, then start the agreement again.",
          });
          setDocuSignConfig((currentConfig) => ({
            ...(currentConfig || {}),
            consentUrl: data.consentUrl,
          }));
          return;
        }

        throw new Error(data.error || "Unable to start the agreement signing session.");
      }

      setEnvelopeId(data.envelopeId || "");
      setRecipientViewUrl(data.recipientViewUrl || "");
      setSigningMessage({
        type: "success",
        text: "Agreement session created. DocuSign is loading now.",
      });
    } catch (error) {
      setSigningMessage({
        type: "error",
        text: error.message || "Unable to start the agreement signing session.",
      });
    } finally {
      setIsStartingSigning(false);
    }
  }

  if (!selectedPurchase) {
    return null;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "8.5rem 1.25rem 4rem",
        background:
          "radial-gradient(circle at top, rgba(206, 66, 43, 0.15), transparent 28rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
      }}
    >
      <div
        style={{
          width: "min(1120px, 100%)",
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <section
          style={{
            border: "1px solid rgba(245, 240, 232, 0.12)",
            background: "rgba(10, 10, 10, 0.88)",
            padding: "clamp(1.5rem, 3vw, 2.4rem)",
            display: "grid",
            gap: "1.25rem",
          }}
        >
          <div>
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
              Guided Checkout
            </span>
            <h1
              style={{
                fontFamily: "var(--font-bebas-neue), sans-serif",
                fontSize: "clamp(3rem, 7vw, 4.8rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: "0 0 0.75rem",
              }}
            >
              Sign First, Pay Second
            </h1>
            <p style={{ color: "rgba(245, 240, 232, 0.76)", lineHeight: 1.8, margin: 0 }}>
              This flow keeps the agreement and payment in the same protected path. Guests are sent
              through login first, and signed-in users can move straight from the agreement to
              PayPal.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            {PURCHASE_OPTIONS.map((purchase) => (
              <PackageOption
                key={purchase.agreementSlug}
                purchase={purchase}
                isActive={purchase.agreementSlug === selectedPurchase.agreementSlug}
              />
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <article
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1.1rem",
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
                  marginBottom: "0.45rem",
                }}
              >
                Selected Package
              </span>
              <strong style={{ display: "block", fontSize: "1.1rem" }}>
                {selectedPurchase.displayName}
              </strong>
            </article>
            <article
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1.1rem",
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
                  marginBottom: "0.45rem",
                }}
              >
                Price
              </span>
              <strong style={{ display: "block", fontSize: "1.1rem" }}>
                {selectedPurchase.priceLabel}
              </strong>
            </article>
            <article
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1.1rem",
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
                  marginBottom: "0.45rem",
                }}
              >
                Current State
              </span>
              <strong style={{ display: "block", fontSize: "1.1rem" }}>
                {checkoutState.payment.isPaid
                  ? "Paid"
                  : checkoutState.signing.isSigned
                    ? "Ready For PayPal"
                    : "Agreement Pending"}
              </strong>
            </article>
          </div>

          {checkoutState.errorMessage ? (
            <MessageBanner message={{ type: "error", text: checkoutState.errorMessage }} />
          ) : null}
        </section>

        <StepCard
          eyebrow="Step 1"
          title="Review And Sign"
          copy="Complete the package agreement first. Once the signed DocuSign event is saved, the PayPal section below unlocks automatically."
          statusLabel={
            checkoutState.signing.isSigned
              ? `Signed ${formatDate(checkoutState.signing.completedAt)}`
              : recipientViewUrl
                ? "Signing In Progress"
                : "Awaiting Signature"
          }
          statusTone={checkoutState.signing.isSigned ? "success" : "default"}
        >
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <label style={{ display: "grid", gap: "0.45rem" }}>
                <span
                  style={{
                    color: "rgba(245, 240, 232, 0.7)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Signer Name
                </span>
                <input
                  style={{
                    width: "100%",
                    minHeight: "3.2rem",
                    border: "1px solid rgba(245, 240, 232, 0.14)",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "var(--white)",
                    padding: "0.85rem 1rem",
                    fontSize: "0.98rem",
                  }}
                  name="signerName"
                  type="text"
                  value={signingForm.signerName}
                  onChange={handleSigningInputChange}
                  disabled={checkoutState.payment.isPaid}
                  required
                />
              </label>

              <label style={{ display: "grid", gap: "0.45rem" }}>
                <span
                  style={{
                    color: "rgba(245, 240, 232, 0.7)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Signer Email
                </span>
                <input
                  style={{
                    width: "100%",
                    minHeight: "3.2rem",
                    border: "1px solid rgba(245, 240, 232, 0.14)",
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "var(--white)",
                    padding: "0.85rem 1rem",
                    fontSize: "0.98rem",
                  }}
                  name="signerEmail"
                  type="email"
                  value={signingForm.signerEmail}
                  onChange={handleSigningInputChange}
                  disabled={checkoutState.payment.isPaid}
                  required
                />
              </label>
            </div>

            <div
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <span
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Agreement
                </span>
                <strong>{checkoutState.agreement?.title || selectedPurchase.agreementTitle}</strong>
              </div>
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <span
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Package
                </span>
                <strong>{selectedPurchase.displayName}</strong>
              </div>
              <div style={{ display: "grid", gap: "0.25rem" }}>
                <span
                  style={{
                    color: "rgba(245, 240, 232, 0.6)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Price
                </span>
                <strong>{selectedPurchase.priceLabel}</strong>
              </div>
            </div>
          </div>

          {isLoadingDocuSignConfig ? (
            <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.85)", lineHeight: 1.7 }}>
              Checking DocuSign configuration...
            </p>
          ) : null}
          {!isLoadingDocuSignConfig && !docuSignConfig?.ready ? (
            <MessageBanner
              message={{
                type: "error",
                text: "DocuSign is not configured yet. Fill the required environment values before using the agreement flow.",
              }}
            />
          ) : null}
          {!isLoadingDocuSignConfig && docuSignConfig?.ready && !docuSignConfig?.firestoreAdminReady ? (
            <MessageBanner
              message={{
                type: "error",
                text: "Firebase Admin server writes are not configured yet, so signed agreement state cannot be stored.",
              }}
            />
          ) : null}

          <MessageBanner message={signingMessage} />
          {docuSignJsError ? (
            <MessageBanner message={{ type: "error", text: docuSignJsError }} />
          ) : null}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            <button
              type="button"
              onClick={handleStartSigning}
              disabled={
                isStartingSigning ||
                checkoutState.payment.isPaid ||
                !docuSignConfig?.ready ||
                !docuSignConfig?.firestoreAdminReady ||
                !signingForm.signerName.trim() ||
                !signingForm.signerEmail.trim()
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "3rem",
                padding: "0.85rem 1.2rem",
                border: "1px solid var(--red)",
                background: "var(--red)",
                color: "var(--white)",
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                opacity:
                  isStartingSigning ||
                  checkoutState.payment.isPaid ||
                  !docuSignConfig?.ready ||
                  !docuSignConfig?.firestoreAdminReady
                    ? 0.65
                    : 1,
              }}
            >
              {checkoutState.signing.isSigned
                ? "Start Another Signature Session"
                : isStartingSigning
                  ? "Starting Agreement..."
                  : "Start Agreement Signing"}
            </button>
            <Link
              href={`/agreements/${selectedPurchase.agreementSlug}`}
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
              Review Full Agreement
            </Link>
            {docuSignConfig?.consentUrl ? (
              <a
                href={docuSignConfig.consentUrl}
                target="_blank"
                rel="noreferrer"
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
                Open DocuSign Consent
              </a>
            ) : null}
          </div>

          {recipientViewUrl ? (
            <div
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.85rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "rgba(245, 240, 232, 0.7)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.72rem",
                }}
              >
                Envelope ID: {selectedEnvelopeId}
              </p>
              {!isDocuSignJsReady ? (
                <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.85)", lineHeight: 1.7 }}>
                  Loading DocuSign focused view...
                </p>
              ) : null}
              <div
                id={FOCUSED_VIEW_MOUNT_ID}
                style={{
                  minHeight: "44rem",
                  border: "1px solid rgba(245, 240, 232, 0.12)",
                  background: "rgba(3, 3, 3, 0.85)",
                }}
              />
            </div>
          ) : null}
        </StepCard>

        <StepCard
          eyebrow="Step 2"
          title="Pay With PayPal"
          copy="Payment stays locked until the agreement is recorded as signed. Once that happens, the PayPal Buttons integration creates and captures the order on the server."
          statusLabel={
            checkoutState.payment.isPaid
              ? `Paid ${formatDate(checkoutState.payment.completedAt)}`
              : isPaymentUnlocked
                ? "Ready For Payment"
                : "Locked Until Signed"
          }
          statusTone={checkoutState.payment.isPaid ? "success" : "default"}
        >
          {!payPalClientId ? (
            <MessageBanner
              message={{
                type: "error",
                text: "NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing, so the PayPal button cannot load.",
              }}
            />
          ) : null}
          {payPalError ? <MessageBanner message={{ type: "error", text: payPalError }} /> : null}
          <MessageBanner message={paymentMessage} />

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  color: "rgba(245, 240, 232, 0.6)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Package
              </span>
              <strong>{selectedPurchase.displayName}</strong>
            </div>
            <div
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  color: "rgba(245, 240, 232, 0.6)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Payment State
              </span>
              <strong>{formatPaymentStatus(checkoutState.payment.status)}</strong>
            </div>
            <div
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  color: "rgba(245, 240, 232, 0.6)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Amount
              </span>
              <strong>{selectedPurchase.priceLabel}</strong>
            </div>
          </div>

          {checkoutState.payment.isPaid ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link
                href={`/logged-in/checkout/success?agreement=${selectedPurchase.agreementSlug}${
                  checkoutState.payment.lastOrderId
                    ? `&orderId=${encodeURIComponent(checkoutState.payment.lastOrderId)}`
                    : ""
                }`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "3rem",
                  padding: "0.85rem 1.2rem",
                  border: "1px solid var(--red)",
                  background: "var(--red)",
                  color: "var(--white)",
                  textDecoration: "none",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                View Success Page
              </Link>
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
                Back To Member Home
              </Link>
            </div>
          ) : null}

          {!checkoutState.payment.isPaid && !checkoutState.signing.isSigned ? (
            <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.78)", lineHeight: 1.7 }}>
              Finish the agreement signature first. Once the signed status is saved, the PayPal
              checkout buttons will appear here automatically.
            </p>
          ) : null}

          {showPayPalMount ? (
            <div
              style={{
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.85rem",
              }}
            >
              <div id={PAYPAL_BUTTON_MOUNT_ID} />
              {isCapturingPayment ? (
                <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.78)", lineHeight: 1.7 }}>
                  Capturing your PayPal payment...
                </p>
              ) : null}
            </div>
          ) : null}
        </StepCard>
      </div>
    </main>
  );
}
