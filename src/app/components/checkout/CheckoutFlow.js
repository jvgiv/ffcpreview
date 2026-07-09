"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import {
  MAX_ADDITIONAL_ORIENTEERS,
  buildCheckoutPurchase,
  formatPaymentStatus,
  listPurchases,
  normalizeAdditionalOrienteerCount,
  normalizeAdditionalPlanTier,
} from "@/lib/purchases";
import styles from "./CheckoutFlow.module.css";

const EMPTY_MESSAGE = {
  type: "",
  text: "",
};

const PURCHASE_OPTIONS = listPurchases();
const FOCUSED_VIEW_MOUNT_ID = "checkout-docusign-focused-view";
const PAYPAL_BUTTON_MOUNT_ID = "checkout-paypal-button-mount";
const SIGNING_DRAFT_STORAGE_PREFIX = "ffc-checkout-signing-draft";
const ADDITIONAL_ORIENTEER_FIELDS = Array.from(
  { length: MAX_ADDITIONAL_ORIENTEERS },
  (_, index) => {
    const number = index + 1;

    return {
      number,
      nameKey: `additionalOrienteer${number}Name`,
      phoneKey: `additionalOrienteer${number}Phone`,
      emailKey: `additionalOrienteer${number}Email`,
    };
  }
);

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

function buildInitialSigningForm() {
  const additionalOrienteerDefaults = Object.fromEntries(
    ADDITIONAL_ORIENTEER_FIELDS.flatMap(({ nameKey, phoneKey, emailKey }) => [
      [nameKey, ""],
      [phoneKey, ""],
      [emailKey, ""],
    ])
  );

  return {
    signerName: "",
    signerEmail: "",
    clientStreetAddress: "",
    clientCityStateZip: "",
    additionalPlanTier: "none",
    additionalCount: "0",
    primaryOrienteerName: "",
    primaryOrienteerPhone: "",
    primaryOrienteerEmail: "",
    ...additionalOrienteerDefaults,
  };
}

function normalizeSigningFormText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSigningFormEmail(value) {
  return normalizeSigningFormText(value).toLowerCase();
}

function buildNormalizedSigningForm(partial = {}) {
  const initialForm = buildInitialSigningForm();

  return Object.fromEntries(
    Object.keys(initialForm).map((key) => [
      key,
      typeof partial?.[key] === "string" ? partial[key] : initialForm[key],
    ])
  );
}

function buildComparableAgreementForm(partial = {}) {
  const normalizedForm = buildNormalizedSigningForm(partial);
  const normalizedAdditionalPlanTier = normalizeAdditionalPlanTier(
    normalizedForm.additionalPlanTier
  );
  const normalizedAdditionalCount =
    normalizedAdditionalPlanTier === "none"
      ? 0
      : normalizeAdditionalOrienteerCount(normalizedForm.additionalCount);
  const includesAdditionalOrienteers = normalizedAdditionalCount > 0;
  const comparableForm = {
    signerName: normalizeSigningFormText(normalizedForm.signerName),
    signerEmail: normalizeSigningFormEmail(normalizedForm.signerEmail),
    clientStreetAddress: normalizeSigningFormText(normalizedForm.clientStreetAddress),
    clientCityStateZip: normalizeSigningFormText(normalizedForm.clientCityStateZip),
    additionalPlanTier: includesAdditionalOrienteers ? normalizedAdditionalPlanTier : "none",
    additionalCount: String(normalizedAdditionalCount),
    primaryOrienteerName: normalizeSigningFormText(normalizedForm.primaryOrienteerName),
    primaryOrienteerPhone: normalizeSigningFormText(normalizedForm.primaryOrienteerPhone),
    primaryOrienteerEmail: normalizeSigningFormEmail(normalizedForm.primaryOrienteerEmail),
  };

  for (const { number, nameKey, phoneKey, emailKey } of ADDITIONAL_ORIENTEER_FIELDS) {
    const includeRow = includesAdditionalOrienteers && normalizedAdditionalCount >= number;

    comparableForm[nameKey] = includeRow
      ? normalizeSigningFormText(normalizedForm[nameKey])
      : "";
    comparableForm[phoneKey] = includeRow
      ? normalizeSigningFormText(normalizedForm[phoneKey])
      : "";
    comparableForm[emailKey] = includeRow
      ? normalizeSigningFormEmail(normalizedForm[emailKey])
      : "";
  }

  return comparableForm;
}

function buildAgreementFormSnapshot(partial = {}) {
  return JSON.stringify(buildComparableAgreementForm(partial));
}

function buildPayorProfileSigningPrefill(profile, authUser) {
  return {
    signerName: profile?.displayName || authUser?.displayName || authUser?.email || "",
    signerEmail: profile?.email || authUser?.email || "",
  };
}

function buildUserProfileSigningPrefill(profile, authUser) {
  return {
    ...buildPayorProfileSigningPrefill(profile, authUser),
    primaryOrienteerName: profile?.displayName || authUser?.displayName || "",
    primaryOrienteerPhone: profile?.phoneNumber || authUser?.phoneNumber || "",
    primaryOrienteerEmail: profile?.email || authUser?.email || "",
  };
}

function getAdditionalPlanSelectionLabel(planTier) {
  if (planTier === "basic") {
    return "Basic Financial Orientation Package";
  }

  if (planTier === "premium") {
    return "Premium Financial Orientation Package";
  }

  return "";
}

function buildSigningFormPatchFromCheckout(checkout) {
  if (!checkout || typeof checkout !== "object") {
    return {};
  }

  const patch = {
    clientStreetAddress: checkout.client?.streetAddress || "",
    clientCityStateZip: checkout.client?.cityStateZip || "",
    additionalPlanTier: checkout.additionalPlanTier || "none",
    additionalCount: String(checkout.additionalCount || 0),
    primaryOrienteerName: checkout.orienteers?.[0]?.name || "",
    primaryOrienteerPhone: checkout.orienteers?.[0]?.phone || "",
    primaryOrienteerEmail: checkout.orienteers?.[0]?.email || "",
  };

  for (const { number, nameKey, phoneKey, emailKey } of ADDITIONAL_ORIENTEER_FIELDS) {
    const orienteer = checkout.orienteers?.[number] || null;

    patch[nameKey] = orienteer?.name || "";
    patch[phoneKey] = orienteer?.phone || "";
    patch[emailKey] = orienteer?.email || "";
  }

  return patch;
}

function buildSigningFormPatchFromStoredSigning(signing) {
  if (!signing || typeof signing !== "object") {
    return {};
  }

  return {
    signerName: signing.signer?.name || "",
    signerEmail: signing.signer?.email || "",
    ...buildSigningFormPatchFromCheckout(signing.checkout),
  };
}

function mergeSigningFormPatch(baseForm, patch) {
  const nextForm = buildNormalizedSigningForm(baseForm);

  if (!patch || typeof patch !== "object") {
    return nextForm;
  }

  for (const key of Object.keys(nextForm)) {
    const value = patch[key];

    if (typeof value === "string" && value !== "") {
      nextForm[key] = value;
    }
  }

  return nextForm;
}

function buildSigningDraftStorageKey(uid, agreementSlug) {
  if (!uid || !agreementSlug) {
    return "";
  }

  return `${SIGNING_DRAFT_STORAGE_PREFIX}:${uid}:${agreementSlug}`;
}

function readSigningFormDraft(storageKey) {
  if (typeof window === "undefined" || !storageKey) {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue);

    return buildNormalizedSigningForm(parsedValue?.form || parsedValue);
  } catch (error) {
    console.error("Unable to read the saved signing draft.", error);
    return null;
  }
}

function writeSigningFormDraft(storageKey, signingForm) {
  if (typeof window === "undefined" || !storageKey) {
    return;
  }

  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        form: buildNormalizedSigningForm(signingForm),
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error("Unable to save the signing draft.", error);
  }
}

function clearSigningFormDraft(storageKey) {
  if (typeof window === "undefined" || !storageKey) {
    return;
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Unable to clear the saved signing draft.", error);
  }
}

const FIELD_LABEL_STYLE = {
  color: "rgba(245, 240, 232, 0.7)",
  fontFamily: "'Space Mono', monospace",
  fontSize: "0.7rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const FIELD_INPUT_STYLE = {
  width: "100%",
  minHeight: "3.2rem",
  padding: "0.85rem 1rem",
  fontSize: "0.98rem",
};

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
  const { authUser, profile, isLoading: isAuthLoading, refreshProfile } = useAuth();
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
  const [signingForm, setSigningForm] = useState(buildInitialSigningForm);
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
  const [agreementFormSnapshot, setAgreementFormSnapshot] = useState("");

  const payPalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const signingDraftStorageKey = buildSigningDraftStorageKey(
    authUser?.uid,
    selectedPurchase?.agreementSlug
  );
  const [hasHydratedSigningDraft, setHasHydratedSigningDraft] = useState(false);

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
    setAgreementFormSnapshot("");
    setSigningForm((currentForm) => ({
      ...currentForm,
      additionalPlanTier: "none",
      additionalCount: "0",
    }));
  }, [selectedPurchase]);

  useEffect(() => {
    setHasHydratedSigningDraft(false);
  }, [signingDraftStorageKey]);

  useEffect(() => {
    if (isAuthLoading || !selectedPurchase) {
      return;
    }

    let nextForm = buildInitialSigningForm();

    nextForm = mergeSigningFormPatch(nextForm, buildUserProfileSigningPrefill(profile, authUser));

    const savedDraft = readSigningFormDraft(signingDraftStorageKey);

    if (savedDraft) {
      nextForm = {
        ...nextForm,
        ...savedDraft,
      };
    }

    setSigningForm(nextForm);
    setHasHydratedSigningDraft(true);
  }, [authUser, isAuthLoading, profile, selectedPurchase, signingDraftStorageKey]);

  useEffect(() => {
    if (!hasHydratedSigningDraft || !signingDraftStorageKey) {
      return;
    }

    if (checkoutState.payment.isPaid) {
      clearSigningFormDraft(signingDraftStorageKey);
      return;
    }

    writeSigningFormDraft(signingDraftStorageKey, signingForm);
  }, [
    checkoutState.payment.isPaid,
    hasHydratedSigningDraft,
    signingDraftStorageKey,
    signingForm,
  ]);

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

      const isPaymentPaid = Boolean(data.payment?.isPaid);
      const checkoutFormPatch = buildSigningFormPatchFromStoredSigning(data.signing);
      const savedDraft = readSigningFormDraft(signingDraftStorageKey);
      const nextAgreementFormSnapshot = data.signing?.isSigned
        ? buildAgreementFormSnapshot(checkoutFormPatch)
        : "";
      let nextForm = buildInitialSigningForm();

      nextForm = mergeSigningFormPatch(
        nextForm,
        isPaymentPaid
          ? buildPayorProfileSigningPrefill(profile, authUser)
          : buildUserProfileSigningPrefill(profile, authUser)
      );
      nextForm = mergeSigningFormPatch(nextForm, checkoutFormPatch);

      if (savedDraft && !isPaymentPaid) {
        nextForm = {
          ...nextForm,
          ...savedDraft,
        };
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
          isPaid: isPaymentPaid,
          lastOrderId: data.payment?.lastOrderId || "",
          payerEmail: data.payment?.payerEmail || "",
          completedAt: data.payment?.completedAt || null,
        },
      });
      setAgreementFormSnapshot(nextAgreementFormSnapshot);
      setSigningForm(nextForm);

      if (isPaymentPaid) {
        clearSigningFormDraft(signingDraftStorageKey);
      }
    } catch (error) {
      setCheckoutState((currentState) => ({
        ...currentState,
        isLoading: false,
        errorMessage: error.message || "Unable to load the checkout state.",
      }));
    }
  });

  const formPurchase =
    buildCheckoutPurchase({
      agreementSlug: selectedPurchase?.agreementSlug,
      additionalPlanTier: signingForm.additionalPlanTier,
      additionalCount: signingForm.additionalCount,
    }) || null;
  const hasAgreementFormChanges =
    Boolean(agreementFormSnapshot) &&
    buildAgreementFormSnapshot(signingForm) !== agreementFormSnapshot;
  const activePurchase = checkoutState.payment.isPaid
    ? checkoutState.purchase || formPurchase || selectedPurchase
    : formPurchase || checkoutState.purchase || selectedPurchase;
  const visibleAdditionalOrienteerCount = activePurchase?.additionalCount || 0;
  const hasAdditionalOrienteers = visibleAdditionalOrienteerCount > 0;
  const selectedAdditionalPlanLabel = getAdditionalPlanSelectionLabel(
    signingForm.additionalPlanTier
  );

  useEffect(() => {
    if (!hasAgreementFormChanges || checkoutState.payment.isPaid) {
      return;
    }

    setRecipientViewUrl("");
    setEnvelopeId("");
    setDocuSignJsError("");
    setPaymentMessage(EMPTY_MESSAGE);
    setCheckoutState((currentState) => ({
      ...currentState,
      signing: {
        isSigned: false,
        envelopeId: "",
        status: "",
        completedAt: null,
      },
    }));
    setSigningMessage({
      type: "success",
      text: "Form changes removed the current agreement session. Start Agreement Signing again to render the updated agreement before payment.",
    });
  }, [checkoutState.payment.isPaid, hasAgreementFormChanges]);

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
          setPaymentMessage({
            type: "success",
            text: "Payment captured. Updating your member homepage now...",
          });
          clearSigningFormDraft(signingDraftStorageKey);
          await refreshProfile();
          router.replace("/logged-in");
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
      ...(name === "additionalPlanTier" && value === "none"
        ? {
            additionalCount: "0",
          }
        : {}),
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
    const submittedAgreementFormSnapshot = buildAgreementFormSnapshot(signingForm);

    try {
      const requestBody = {
        signerName: signingForm.signerName.trim(),
        signerEmail: signingForm.signerEmail.trim(),
        agreementSlug: selectedPurchase.agreementSlug,
        clientStreetAddress: signingForm.clientStreetAddress.trim(),
        clientCityStateZip: signingForm.clientCityStateZip.trim(),
        additionalPlanTier: signingForm.additionalPlanTier,
        additionalCount: signingForm.additionalCount,
        primaryOrienteerName: signingForm.primaryOrienteerName.trim(),
        primaryOrienteerPhone: signingForm.primaryOrienteerPhone.trim(),
        primaryOrienteerEmail: signingForm.primaryOrienteerEmail.trim(),
      };

      for (const { nameKey, phoneKey, emailKey } of ADDITIONAL_ORIENTEER_FIELDS) {
        requestBody[nameKey] = signingForm[nameKey].trim();
        requestBody[phoneKey] = signingForm[phoneKey].trim();
        requestBody[emailKey] = signingForm[emailKey].trim();
      }

      const response = await fetch("/api/docusign/embedded-signing", {
        method: "POST",
        headers: await getAuthorizedHeaders(),
        body: JSON.stringify(requestBody),
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
      setAgreementFormSnapshot(submittedAgreementFormSnapshot);
      setCheckoutState((currentState) => ({
        ...currentState,
        purchase: data.purchase || currentState.purchase,
      }));
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
                {activePurchase?.displayName || selectedPurchase.displayName}
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
                {activePurchase?.priceLabel || selectedPurchase.priceLabel}
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
          copy="Capture the payor details and program selections first, then sign the agreement. Available profile details prefill the form, and your edits stay saved in this browser while you work."
          statusLabel={
            checkoutState.signing.isSigned
              ? `Signed ${formatDate(checkoutState.signing.completedAt)}`
              : recipientViewUrl
                ? "Signing In Progress"
                : "Awaiting Signature"
          }
          statusTone={checkoutState.signing.isSigned ? "success" : "default"}
        >
          <div className={styles.stepLayout}>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  border: "1px solid rgba(245, 240, 232, 0.12)",
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "1rem",
                  display: "grid",
                  gap: "0.9rem",
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
                  Payor Details
                </span>
                <div
                  style={{
                    display: "grid",
                    gap: "0.85rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  }}
                >
                  <label className={styles.fieldGroup}>
                    <span style={FIELD_LABEL_STYLE}>Signer Name</span>
                    <input
                      className={styles.fieldInput}
                      style={FIELD_INPUT_STYLE}
                      name="signerName"
                      type="text"
                      value={signingForm.signerName}
                      onChange={handleSigningInputChange}
                      disabled={checkoutState.payment.isPaid}
                      required
                    />
                  </label>

                  <label className={styles.fieldGroup}>
                    <span style={FIELD_LABEL_STYLE}>Signer Email</span>
                    <input
                      className={styles.fieldInput}
                      style={FIELD_INPUT_STYLE}
                      name="signerEmail"
                      type="email"
                      value={signingForm.signerEmail}
                      onChange={handleSigningInputChange}
                      disabled={checkoutState.payment.isPaid}
                      required
                    />
                  </label>

                  <label className={styles.fieldGroup}>
                    <span style={FIELD_LABEL_STYLE}>Client Street Address</span>
                    <input
                      className={styles.fieldInput}
                      style={FIELD_INPUT_STYLE}
                      name="clientStreetAddress"
                      type="text"
                      value={signingForm.clientStreetAddress}
                      onChange={handleSigningInputChange}
                      disabled={checkoutState.payment.isPaid}
                      required
                    />
                  </label>

                  <label className={styles.fieldGroup}>
                    <span style={FIELD_LABEL_STYLE}>Client City, State & Zip</span>
                    <input
                      className={styles.fieldInput}
                      style={FIELD_INPUT_STYLE}
                      name="clientCityStateZip"
                      type="text"
                      value={signingForm.clientCityStateZip}
                      onChange={handleSigningInputChange}
                      disabled={checkoutState.payment.isPaid}
                      required
                    />
                  </label>
                </div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(245, 240, 232, 0.12)",
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "1rem",
                  display: "grid",
                  gap: "0.9rem",
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
                  Program Choices
                </span>
                <div
                  style={{
                    display: "grid",
                    gap: "0.85rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  }}
                >
                  <label className={styles.fieldGroup}>
                    <span style={FIELD_LABEL_STYLE}>Additional Orienteer Package</span>
                    <select
                      className={styles.fieldInput}
                      style={FIELD_INPUT_STYLE}
                      name="additionalPlanTier"
                      value={signingForm.additionalPlanTier}
                      onChange={handleSigningInputChange}
                      disabled={checkoutState.payment.isPaid}
                    >
                      <option value="none">No Additional Orienteers</option>
                      <option value="basic">Basic Financial Orientation Package</option>
                      <option value="premium">Premium Financial Orientation Package</option>
                    </select>
                  </label>

                  <label className={styles.fieldGroup}>
                    <span style={FIELD_LABEL_STYLE}>
                      {selectedAdditionalPlanLabel
                        ? `${selectedAdditionalPlanLabel} Count`
                        : "Additional Orienteer Count"}
                    </span>
                    <input
                      className={styles.fieldInput}
                      style={FIELD_INPUT_STYLE}
                      name="additionalCount"
                      type="number"
                      min="0"
                      max={MAX_ADDITIONAL_ORIENTEERS}
                      value={signingForm.additionalCount}
                      onChange={handleSigningInputChange}
                      disabled={
                        checkoutState.payment.isPaid ||
                        signingForm.additionalPlanTier === "none"
                      }
                    />
                  </label>
                </div>
                <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.7)", lineHeight: 1.7 }}>
                  The selected package card controls the first Orienteer tier. Any additional
                  Orienteers you add here, up to {MAX_ADDITIONAL_ORIENTEERS}, will be written
                  into page 2 of the agreement and rolled into the PayPal total automatically.
                </p>
              </div>

              <div
                style={{
                  border: "1px solid rgba(245, 240, 232, 0.12)",
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "1rem",
                  display: "grid",
                  gap: "0.9rem",
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
                  Orienteers
                </span>
                <div className={styles.orienteerGrid}>
                  <div className={styles.orienteerRow}>
                    <label className={styles.fieldGroup}>
                      <span style={FIELD_LABEL_STYLE}>Primary Orienteer Name</span>
                      <input
                        className={styles.fieldInput}
                        style={FIELD_INPUT_STYLE}
                        name="primaryOrienteerName"
                        type="text"
                        value={signingForm.primaryOrienteerName}
                        onChange={handleSigningInputChange}
                        disabled={checkoutState.payment.isPaid}
                      />
                    </label>

                    <label className={styles.fieldGroup}>
                      <span style={FIELD_LABEL_STYLE}>Primary Orienteer Phone</span>
                      <input
                        className={styles.fieldInput}
                        style={FIELD_INPUT_STYLE}
                        name="primaryOrienteerPhone"
                        type="text"
                        value={signingForm.primaryOrienteerPhone}
                        onChange={handleSigningInputChange}
                        disabled={checkoutState.payment.isPaid}
                      />
                    </label>

                    <label className={styles.fieldGroup}>
                      <span style={FIELD_LABEL_STYLE}>Primary Orienteer Email</span>
                      <input
                        className={styles.fieldInput}
                        style={FIELD_INPUT_STYLE}
                        name="primaryOrienteerEmail"
                        type="email"
                        value={signingForm.primaryOrienteerEmail}
                        onChange={handleSigningInputChange}
                        disabled={checkoutState.payment.isPaid}
                      />
                    </label>
                  </div>

                  {ADDITIONAL_ORIENTEER_FIELDS.slice(0, visibleAdditionalOrienteerCount).map(
                    ({ number, nameKey, phoneKey, emailKey }) => (
                      <div className={styles.orienteerRow} key={number}>
                        <label className={styles.fieldGroup}>
                          <span style={FIELD_LABEL_STYLE}>
                            Additional Orienteer {number} Name
                          </span>
                          <input
                            className={styles.fieldInput}
                            style={FIELD_INPUT_STYLE}
                            name={nameKey}
                            type="text"
                            value={signingForm[nameKey]}
                            onChange={handleSigningInputChange}
                            disabled={checkoutState.payment.isPaid}
                          />
                        </label>

                        <label className={styles.fieldGroup}>
                          <span style={FIELD_LABEL_STYLE}>
                            Additional Orienteer {number} Phone
                          </span>
                          <input
                            className={styles.fieldInput}
                            style={FIELD_INPUT_STYLE}
                            name={phoneKey}
                            type="text"
                            value={signingForm[phoneKey]}
                            onChange={handleSigningInputChange}
                            disabled={checkoutState.payment.isPaid}
                          />
                        </label>

                        <label className={styles.fieldGroup}>
                          <span style={FIELD_LABEL_STYLE}>
                            Additional Orienteer {number} Email
                          </span>
                          <input
                            className={styles.fieldInput}
                            style={FIELD_INPUT_STYLE}
                            name={emailKey}
                            type="email"
                            value={signingForm[emailKey]}
                            onChange={handleSigningInputChange}
                            disabled={checkoutState.payment.isPaid}
                          />
                        </label>
                      </div>
                    )
                  )}
                </div>
                <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.7)", lineHeight: 1.7 }}>
                  {hasAdditionalOrienteers
                    ? "The payor information on page 5 comes from the signer and address fields above. The additional Orienteer lines below fill the page 2 table in the agreement."
                    : "The primary Orienteer line starts with your saved profile details when available. Increase the additional count above to fill the page 2 additional-Orienteer table on the agreement."}
                </p>
              </div>
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
                <strong>{activePurchase?.displayName || selectedPurchase.displayName}</strong>
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
                  Pricing Breakdown
                </span>
                <strong>{activePurchase?.pricingBreakdown || activePurchase?.priceLabel}</strong>
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
                <strong>{activePurchase?.priceLabel || selectedPurchase.priceLabel}</strong>
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
                  Agreement PDF
                </span>
                <strong>Page 2 choices + page 5 payor and Orienteer lines will be prefilled</strong>
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
              href="/files/agreement.pdf"
              target="_blank"
              rel="noopener noreferrer"
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
              <strong>{activePurchase?.displayName || selectedPurchase.displayName}</strong>
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
              <strong>{activePurchase?.priceLabel || selectedPurchase.priceLabel}</strong>
            </div>
          </div>

          {checkoutState.payment.isPaid ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link
                href="/logged-in"
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
                Go To Member Homepage
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
