"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { AGE_RANGE_OPTIONS } from "@/lib/firebase/profileOptions";
import { useAuthenticatedProfileImage } from "@/lib/firebase/useAuthenticatedProfileImage";
import { getPurchaseBySlug, isPaymentComplete } from "@/lib/purchases";

const pageStyle = {
  minHeight: "100vh",
  padding: "8.5rem 1.25rem 4rem",
  background:
    "radial-gradient(circle at top, rgba(206, 66, 43, 0.15), transparent 28rem), linear-gradient(180deg, #090909 0%, #111111 100%)",
};

const shellStyle = {
  width: "min(1120px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: "1.5rem",
};

const panelStyle = {
  border: "1px solid rgba(245, 240, 232, 0.12)",
  background: "rgba(10, 10, 10, 0.88)",
  padding: "clamp(1.5rem, 3vw, 2.4rem)",
};

const primaryButtonStyle = {
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
};

const secondaryButtonStyle = {
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
};

const disabledButtonStyle = {
  ...secondaryButtonStyle,
  border: "1px solid rgba(245, 240, 232, 0.12)",
  background: "rgba(245, 240, 232, 0.05)",
  color: "rgba(245, 240, 232, 0.5)",
  cursor: "not-allowed",
};

const fieldStackStyle = {
  display: "grid",
  gap: "1rem",
};

const fieldLabelStyle = {
  display: "block",
  color: "rgba(245, 240, 232, 0.7)",
  fontFamily: "'Space Mono', monospace",
  fontSize: "0.7rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: "0.45rem",
};

const fieldInputStyle = {
  width: "100%",
  minHeight: "3.2rem",
  border: "1px solid rgba(245, 240, 232, 0.14)",
  background: "rgba(255, 255, 255, 0.04)",
  color: "var(--white)",
  padding: "0.85rem 1rem",
  fontSize: "0.98rem",
};

const fieldInputActiveStyle = {
  background: "rgba(8, 8, 8, 0.96)",
  color: "var(--white)",
};

const inlineButtonStyle = {
  ...primaryButtonStyle,
  cursor: "pointer",
};

const dangerButtonStyle = {
  ...primaryButtonStyle,
  border: "1px solid rgba(206, 66, 43, 0.7)",
  background: "rgba(206, 66, 43, 0.16)",
  color: "#ffd8cf",
  cursor: "pointer",
};

const PROGRAM_ACCESS = [
  getPurchaseBySlug("financial-orientation"),
  getPurchaseBySlug("premium-expansion-pack"),
].filter(Boolean);

const MAX_PROFILE_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function buildFormState(profile, authUser) {
  return {
    displayName: profile?.displayName || authUser?.displayName || "",
    phoneNumber: profile?.phoneNumber || authUser?.phoneNumber || "",
    zipCode: profile?.zipCode || "",
    ageRange: profile?.ageRange || "",
  };
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "grid", gap: "0.15rem" }}>
      <span
        style={{
          color: "rgba(245, 240, 232, 0.55)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ color: "rgba(245, 240, 232, 0.9)", lineHeight: 1.6 }}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

function MessageBanner({ type, message }) {
  if (!message) {
    return null;
  }

  const isError = type === "error";

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
      {message}
    </p>
  );
}

function getAccessBadgeStyles(tone) {
  if (tone === "success") {
    return {
      border: "1px solid rgba(148, 187, 91, 0.36)",
      background: "rgba(148, 187, 91, 0.12)",
      color: "#eef8dd",
    };
  }

  if (tone === "accent") {
    return {
      border: "1px solid rgba(206, 66, 43, 0.45)",
      background: "rgba(206, 66, 43, 0.12)",
      color: "#ffd8cf",
    };
  }

  return {
    border: "1px solid rgba(245, 240, 232, 0.16)",
    background: "rgba(245, 240, 232, 0.06)",
    color: "rgba(245, 240, 232, 0.9)",
  };
}

function AccessCard({ item }) {
  const badgeStyles = getAccessBadgeStyles(item.badgeTone);
  const actionStyle = item.isDisabled
    ? disabledButtonStyle
    : item.isPrimary
      ? primaryButtonStyle
      : secondaryButtonStyle;

  return (
    <article
      style={{
        border: "1px solid rgba(245, 240, 232, 0.12)",
        background: item.isDisabled ? "rgba(22, 22, 22, 0.88)" : "rgba(12, 12, 12, 0.9)",
        padding: "1.2rem",
        display: "grid",
        gap: "0.9rem",
        opacity: item.isDisabled ? 0.58 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.85rem",
          alignItems: "start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: "0.45rem" }}>
          <h3 style={{ margin: 0, color: "var(--white)", fontSize: "1.15rem" }}>{item.title}</h3>
          <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7 }}>
            {item.description}
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
            ...badgeStyles,
          }}
        >
          {item.badgeLabel}
        </span>
      </div>

      <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.58)", lineHeight: 1.7 }}>
        {item.meta}
      </p>

      {!item.ctaLabel ? null : item.isDisabled ? (
        <span style={actionStyle} aria-disabled="true">
          {item.ctaLabel}
        </span>
      ) : item.isDownload ? (
        <a href={item.href} download style={actionStyle}>
          {item.ctaLabel}
        </a>
      ) : item.isExternal ? (
        <a href={item.href} style={actionStyle}>
          {item.ctaLabel}
        </a>
      ) : (
        <Link href={item.href} style={actionStyle}>
          {item.ctaLabel}
        </Link>
      )}
    </article>
  );
}

export default function ClientDashboard({
  authUser,
  profile,
  displayName,
  refreshProfile,
}) {
  const router = useRouter();
  const profileImageUrl = useAuthenticatedProfileImage(authUser, profile);
  const [formData, setFormData] = useState(() => buildFormState(profile, authUser));
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailPreferenceErrorMessage, setEmailPreferenceErrorMessage] = useState("");
  const [emailPreferenceSuccessMessage, setEmailPreferenceSuccessMessage] = useState("");
  const [profileImageErrorMessage, setProfileImageErrorMessage] = useState("");
  const [profileImageSuccessMessage, setProfileImageSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingEmailPreference, setIsSavingEmailPreference] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAgeRangeFocused, setIsAgeRangeFocused] = useState(false);
  const [doNotSendEmail, setDoNotSendEmail] = useState(
    () => profile?.doNotSendEmail === true
  );
  const paymentSummary = profile?.paymentSummary || {};
  const purchasedPrograms = PROGRAM_ACCESS.filter((purchase) =>
    isPaymentComplete(paymentSummary?.[purchase.agreementSlug]?.status)
  );
  const isOrienteer = purchasedPrograms.length > 0;
  const accountTypeLabel = isOrienteer ? "Orienteer" : "Registrant";
  const registrantAccessItems = [
    {
      title: "CaddyBook of Orientation",
      description:
        "Keep the foundational guide nearby as you begin finding your bearings across your financial life.",
      meta: "Included with registration",
      href: "/files/CaddyBook.pdf",
      ctaLabel: "Download CaddyBook",
      badgeLabel: "Registrant Access",
      badgeTone: "success",
      isDownload: true,
    },
    {
      title: "Orientation ScoreCard",
      description:
        "Use the ScoreCard to take stock of the eighteen areas that shape your financial orientation.",
      meta: "Included with registration",
      href: "/scorecard.pdf",
      ctaLabel: "Download ScoreCard",
      badgeLabel: "Registrant Access",
      badgeTone: "success",
      isDownload: true,
    },
    {
      title: "Thought Gallery",
      description:
        "Explore writing and perspective pieces that support the broader Far Flung Change philosophy.",
      meta: "Included with registration",
      href: "/thoughtgallery",
      ctaLabel: "Open Thought Gallery",
      badgeLabel: "Registrant Access",
      badgeTone: "success",
    },
  ];
  const orienteerBenefitItems = [
    {
      title: "Dogstar Definitions",
      description:
        "A plain-language financial vocabulary built to make concepts, terms, and trade-offs easier to navigate.",
      meta: "Included with Core and Premium Programs",
      badgeLabel: "Orienteer Benefit",
      badgeTone: "accent",
    },
    {
      title: "Treasure Map",
      description:
        "A guided view of where you stand now, what matters most, and the terrain between you and your destination.",
      meta: "Included with Core and Premium Programs",
      badgeLabel: "Orienteer Benefit",
      badgeTone: "accent",
    },
    {
      title: "I-RL System (Inquiry Response Loop System)",
      description:
        "A direct loop for asking real-world financial questions and receiving clear, fiduciary-level responses.",
      meta: "Included with Core and Premium Programs",
      badgeLabel: "Orienteer Benefit",
      badgeTone: "accent",
    },
  ];
  const programOptionItems = PROGRAM_ACCESS.map((purchase) => ({
    title: purchase.displayName,
    description:
      purchase.agreementSlug === "financial-orientation"
        ? "Your foundational toolkit for financial clarity, including your Treasure Map and financial vocabulary."
        : "Everything in Core, plus real-time structure and accountability built around your Treasure Map.",
    meta: `${purchase.priceLabel} for one year of Caddy Service`,
    href: `/logged-in/checkout?agreement=${purchase.agreementSlug}`,
    ctaLabel: `Choose ${purchase.displayName}`,
    badgeLabel: "Paid Program",
    badgeTone: "accent",
    isPrimary: true,
  }));
  const memberAccessItems = isOrienteer
    ? [
        ...purchasedPrograms.map((purchase) => {
          const summary = paymentSummary?.[purchase.agreementSlug] || null;

          return {
            title: purchase.displayName,
            description:
              "Your agreement and payment are already tied to this program. Reopen the checkout page any time to review.",
            meta: summary?.completedAt
              ? `Purchased on ${new Date(summary.completedAt).toLocaleDateString("en-US")}`
              : "Purchased and active",
            href: `/logged-in/checkout?agreement=${purchase.agreementSlug}`,
            ctaLabel: "Review Program",
            badgeLabel: "Purchased",
            badgeTone: "success",
          };
        }),
        {
          title: "Dogstar Definitions",
          description:
            "Browse the definitions library so concepts, terms, and trade-offs stay within easy reach.",
          meta: "Unlocked through your paid program",
          href: "/orientation/definitions",
          ctaLabel: "Open Definitions",
          badgeLabel: "Unlocked",
          badgeTone: "success",
        },
        {
          title: "Orientation ScoreCard",
          description:
            "Download your ScoreCard and revisit the eighteen areas that shape your financial orientation.",
          meta: "Orienteer download",
          href: "/scorecard.pdf",
          ctaLabel: "Download ScoreCard",
          badgeLabel: "Unlocked",
          badgeTone: "success",
          isDownload: true,
        },
        {
          title: "Treasure Map",
          description:
            "Begin mapping where you stand now, what matters most, and the financial terrain ahead.",
          meta: "Guided Orienteer resource",
          href: "mailto:deliberate@FarFlungChange.com?subject=Begin%20My%20Treasure%20Map",
          ctaLabel: "Begin Mapping",
          badgeLabel: "Unlocked",
          badgeTone: "success",
          isPrimary: true,
          isExternal: true,
        },
        {
          title: "The CaddyBook of Orientation",
          description:
            "Download the foundational guide again whenever you want to revisit your orientation.",
          meta: "Orienteer download",
          href: "/files/CaddyBook.pdf",
          ctaLabel: "Download CaddyBook",
          badgeLabel: "Unlocked",
          badgeTone: "success",
          isDownload: true,
        },
      ]
    : registrantAccessItems;
  const primaryPurchasedProgram = purchasedPrograms[0] || null;

  useEffect(() => {
    setFormData(buildFormState(profile, authUser));
    setDoNotSendEmail(profile?.doNotSendEmail === true);
  }, [authUser, profile]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaveErrorMessage("");
    setDeleteErrorMessage("");
    setSuccessMessage("");

    const nextProfile = {
      displayName: formData.displayName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      zipCode: formData.zipCode.trim(),
      ageRange: formData.ageRange,
    };

    if (!nextProfile.displayName) {
      setSaveErrorMessage("Please enter your full name.");
      return;
    }

    if (!nextProfile.phoneNumber) {
      setSaveErrorMessage("Please enter a phone number.");
      return;
    }

    if (!nextProfile.zipCode) {
      setSaveErrorMessage("Please enter a zip code.");
      return;
    }

    if (!nextProfile.ageRange) {
      setSaveErrorMessage("Please choose an age range.");
      return;
    }

    if (!authUser) {
      setSaveErrorMessage("Sign in again before updating your account.");
      return;
    }

    setIsSaving(true);

    try {
      const idToken = await authUser.getIdToken();
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(nextProfile),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update your account.");
      }

      setFormData((currentState) => ({
        ...currentState,
        ...data.profile,
      }));

      try {
        await authUser.reload();
      } catch (reloadError) {
        console.error("Firebase auth user reload failed", reloadError);
      }

      if (typeof refreshProfile === "function") {
        await refreshProfile();
      }

      setSuccessMessage("Your account information has been updated.");
    } catch (error) {
      setSaveErrorMessage(error.message || "Unable to update your account.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEmailPreferenceChange(event) {
    const nextDoNotSendEmail = event.target.checked;
    const previousDoNotSendEmail = doNotSendEmail;

    setDoNotSendEmail(nextDoNotSendEmail);
    setEmailPreferenceErrorMessage("");
    setEmailPreferenceSuccessMessage("");

    if (!authUser) {
      setDoNotSendEmail(previousDoNotSendEmail);
      setEmailPreferenceErrorMessage(
        "Sign in again before updating your email preference."
      );
      return;
    }

    setIsSavingEmailPreference(true);

    try {
      const idToken = await authUser.getIdToken();
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ doNotSendEmail: nextDoNotSendEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update your email preference.");
      }

      setDoNotSendEmail(data.profile?.doNotSendEmail === true);

      if (typeof refreshProfile === "function") {
        await refreshProfile();
      }

      setEmailPreferenceSuccessMessage(
        nextDoNotSendEmail
          ? "Email preference saved. We will not send non-essential email to this account."
          : "Email preference saved. Non-essential account email is allowed again."
      );
    } catch (error) {
      setDoNotSendEmail(previousDoNotSendEmail);
      setEmailPreferenceErrorMessage(
        error.message || "Unable to update your email preference."
      );
    } finally {
      setIsSavingEmailPreference(false);
    }
  }

  async function handleProfileImageChange(event) {
    const input = event.target;
    const image = input.files?.[0] || null;

    setProfileImageErrorMessage("");
    setProfileImageSuccessMessage("");

    if (!image) {
      return;
    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.has(image.type)) {
      setProfileImageErrorMessage("Choose a JPG, PNG, WebP, or GIF image.");
      input.value = "";
      return;
    }

    if (image.size > MAX_PROFILE_IMAGE_SIZE) {
      setProfileImageErrorMessage("Profile images must be 4 MB or smaller.");
      input.value = "";
      return;
    }

    if (!authUser) {
      setProfileImageErrorMessage("Sign in again before uploading a profile image.");
      input.value = "";
      return;
    }

    setIsUploadingProfileImage(true);

    try {
      const idToken = await authUser.getIdToken();
      const uploadData = new FormData();
      uploadData.append("profileImage", image);
      const response = await fetch("/api/account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: uploadData,
      });
      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          const hostingErrorMessage =
            response.status === 413
              ? "Profile images must be 4 MB or smaller."
              : `The upload service returned an unexpected response (HTTP ${response.status}).`;

          throw new Error(hostingErrorMessage);
        }
      }

      if (!response.ok) {
        const reference =
          response.status >= 500 && data.requestId
            ? ` Reference: ${data.requestId}`
            : "";

        throw new Error(
          `${data.error || "Unable to upload your profile image."}${reference}`
        );
      }

      if (typeof refreshProfile === "function") {
        await refreshProfile();
      }

      setProfileImageSuccessMessage(
        "Profile image updated. It now appears in your account menu."
      );
    } catch (error) {
      setProfileImageErrorMessage(
        error.message || "Unable to upload your profile image."
      );
    } finally {
      setIsUploadingProfileImage(false);
      input.value = "";
    }
  }

  async function handleDeleteAccount() {
    if (!authUser || isDeleting) {
      return;
    }

    const shouldDelete = window.confirm(
      "Permanently delete your account? Your login, profile, saved email preference, and dashboard access will be removed. This cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    setDeleteErrorMessage("");
    setSaveErrorMessage("");
    setSuccessMessage("");
    setIsDeleting(true);

    try {
      const idToken = await authUser.getIdToken();
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete your account.");
      }

      try {
        await signOut(getFirebaseAuth());
      } catch (signOutError) {
        console.error("Firebase sign-out after account deletion failed", signOutError);
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setDeleteErrorMessage(error.message || "Unable to delete your account.");
      setIsDeleting(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={panelStyle}>
          <span
            style={{
              display: "inline-block",
              color: "var(--red)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
            }}
          >
            {isOrienteer ? "Orienteer Home" : "Registrant Home"}
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
            Welcome, {displayName || accountTypeLabel}
          </h1>
          <p style={{ color: "rgba(245, 240, 232, 0.75)", lineHeight: 1.8, margin: 0 }}>
            {isOrienteer ? (
              <>
                Signed in as <strong style={{ color: "var(--white)" }}>Orienteer</strong>. This
                page is your home for the resources, documents, and program connected to your
                account.
              </>
            ) : (
              <>
                Thanks for registering your account. Please checkout what you have unlocked and
                send us any questions you have about Financial Orientation.
              </>
            )}
          </p>
        </section>

        <section id="member-access" style={panelStyle}>
          <h2
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 0.35rem",
            }}
          >
            {isOrienteer ? "Your Member Access" : "Your Registrant Access"}
          </h2>
          <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            {isOrienteer
              ? "Your paid program appears first, followed by the tools unlocked with your Orienteer access."
              : "These resources are unlocked and ready to use with your registered account."}
          </p>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            {memberAccessItems.map((item) => (
              <AccessCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        {!isOrienteer ? (
          <>
            <section style={panelStyle}>
              <h2
                style={{
                  fontFamily: "var(--font-bebas-neue), sans-serif",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  margin: "0 0 0.35rem",
                }}
              >
                Orienteers Receive
              </h2>
              <p
                style={{
                  color: "rgba(245, 240, 232, 0.72)",
                  lineHeight: 1.7,
                  margin: "0 0 1.25rem",
                }}
              >
                Choose a paid program to add guided orientation and these tools to your account.
              </p>
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                }}
              >
                {orienteerBenefitItems.map((item) => (
                  <AccessCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section style={panelStyle}>
              <h2
                style={{
                  fontFamily: "var(--font-bebas-neue), sans-serif",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  margin: "0 0 0.35rem",
                }}
              >
                Choose Your Program
              </h2>
              <p
                style={{
                  color: "rgba(245, 240, 232, 0.72)",
                  lineHeight: 1.7,
                  margin: "0 0 1.25rem",
                }}
              >
                Both paths provide one year of Financial Orientation. Choose the level of support
                that fits how you want to move forward.
              </p>
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {programOptionItems.map((item) => (
                  <AccessCard key={item.title} item={item} />
                ))}
              </div>
            </section>
          </>
        ) : null}

        <section
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <article style={panelStyle}>
            <h2
              style={{
                fontFamily: "var(--font-bebas-neue), sans-serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: "0 0 0.35rem",
              }}
            >
              Account Overview
            </h2>
            <p
              style={{
                color: "rgba(245, 240, 232, 0.72)",
                lineHeight: 1.7,
                margin: "0 0 1.25rem",
              }}
            >
              Your sign-in email is shown here for reference. Profile edits are managed in the form
              below.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                padding: "1rem",
                marginBottom: "1.25rem",
                border: "1px solid rgba(245, 240, 232, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <div
                role="img"
                aria-label={
                  profileImageUrl
                    ? "Current profile image"
                    : "Default profile image"
                }
                style={{
                  width: "5rem",
                  height: "5rem",
                  flex: "0 0 5rem",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                  border: "1px solid rgba(245, 240, 232, 0.28)",
                  borderRadius: "50%",
                  backgroundColor: "rgba(245, 240, 232, 0.06)",
                  backgroundImage: profileImageUrl
                    ? `url("${profileImageUrl}")`
                    : "none",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  color: "rgba(245, 240, 232, 0.72)",
                  fontFamily: "var(--font-bebas-neue), sans-serif",
                  fontSize: "1.4rem",
                  letterSpacing: "0.08em",
                }}
              >
                {profileImageUrl
                  ? null
                  : (displayName || accountTypeLabel).slice(0, 2).toUpperCase()}
              </div>
              <div style={{ display: "grid", gap: "0.55rem", flex: "1 1 210px" }}>
                <strong style={{ color: "var(--white)" }}>Profile Image</strong>
                <span style={{ color: "rgba(245, 240, 232, 0.62)", lineHeight: 1.6 }}>
                  Upload a JPG, PNG, WebP, or GIF up to 4 MB and 4096 pixels per side. Square
                  images work best; animated images use their first frame.
                </span>
                <label
                  style={{
                    ...secondaryButtonStyle,
                    width: "fit-content",
                    cursor: isUploadingProfileImage ? "wait" : "pointer",
                  }}
                >
                  {isUploadingProfileImage ? "Uploading..." : "Choose Profile Image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleProfileImageChange}
                    disabled={
                      isSaving ||
                      isSavingEmailPreference ||
                      isUploadingProfileImage ||
                      isDeleting
                    }
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  />
                </label>
              </div>
              <div style={{ flexBasis: "100%" }}>
                <MessageBanner type="error" message={profileImageErrorMessage} />
                <MessageBanner type="success" message={profileImageSuccessMessage} />
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <SummaryRow label="Full Name" value={profile?.displayName || authUser?.displayName} />
              <SummaryRow label="Sign-In Email" value={profile?.email || authUser?.email} />
              <SummaryRow label="Phone Number" value={profile?.phoneNumber || authUser?.phoneNumber} />
              <SummaryRow label="Zip Code" value={profile?.zipCode} />
              <SummaryRow label="Age Range" value={profile?.ageRange} />
              <SummaryRow label="Account Type" value={accountTypeLabel} />
            </div>
          </article>

          <article style={panelStyle}>
            <h2
              style={{
                fontFamily: "var(--font-bebas-neue), sans-serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: "0 0 0.35rem",
              }}
            >
              Quick Account Tools
            </h2>
            <p
              style={{
                color: "rgba(245, 240, 232, 0.72)",
                lineHeight: 1.7,
                margin: "0 0 1.25rem",
              }}
            >
              These are the account-management shortcuts you are most likely to need between visits.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link href="/forgot-password" style={primaryButtonStyle}>
                Reset Password
              </Link>
              {isOrienteer && primaryPurchasedProgram ? (
                <Link
                  href={`/logged-in/checkout?agreement=${primaryPurchasedProgram.agreementSlug}`}
                  style={secondaryButtonStyle}
                >
                  Review My Program
                </Link>
              ) : (
                <Link href="/logged-in/checkout" style={secondaryButtonStyle}>
                  View Checkout Options
                </Link>
              )}
              <Link href="/agreements" style={secondaryButtonStyle}>
                Review Agreements
              </Link>
              <Link href="/logged-in/documents" style={secondaryButtonStyle}>
                View Signed Documents
              </Link>
              <Link href="/account/favorites" style={secondaryButtonStyle}>
                View Definition Favorites
              </Link>
              <Link href="/" style={secondaryButtonStyle}>
                Back Home
              </Link>
            </div>
          </article>
        </section>

        <section style={panelStyle}>
          <h2
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 0.35rem",
            }}
          >
            Update Account Information
          </h2>
          <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            Keep your name and contact details current so your account experience stays tied to the
            right information.
          </p>

          <form onSubmit={handleSave} style={fieldStackStyle}>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <label>
                <span style={fieldLabelStyle}>Full Name</span>
                <input
                  style={fieldInputStyle}
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                <span style={fieldLabelStyle}>Phone Number</span>
                <input
                  style={fieldInputStyle}
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </label>

              <label>
                <span style={fieldLabelStyle}>Zip Code</span>
                <input
                  style={fieldInputStyle}
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                />
              </label>

              <label>
                <span style={fieldLabelStyle}>Age Range</span>
                <select
                  style={
                    isAgeRangeFocused
                      ? { ...fieldInputStyle, ...fieldInputActiveStyle }
                      : fieldInputStyle
                  }
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleChange}
                  onFocus={() => setIsAgeRangeFocused(true)}
                  onBlur={() => setIsAgeRangeFocused(false)}
                  required
                >
                  <option value="">Select an age range</option>
                  {AGE_RANGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p style={{ color: "rgba(245, 240, 232, 0.6)", lineHeight: 1.7, margin: 0 }}>
              Your sign-in email stays read-only here. If you need to regain access to your
              account, you can use the password reset link above.
            </p>

            <MessageBanner type="error" message={saveErrorMessage} />
            <MessageBanner type="success" message={successMessage} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <button
                type="submit"
                style={inlineButtonStyle}
                disabled={
                  isSaving ||
                  isSavingEmailPreference ||
                  isUploadingProfileImage ||
                  isDeleting
                }
              >
                {isSaving ? "Saving..." : "Save Account Changes"}
              </button>
            </div>
          </form>
        </section>

        <section style={panelStyle}>
          <h2
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: "0 0 0.35rem",
              color: "var(--white)",
            }}
          >
            Take A Step Back
          </h2>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              color: "rgba(245, 240, 232, 0.72)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ margin: 0 }}>
              If you want fewer messages but still want access to your account, update your email
              preference below instead of deleting your account.
            </p>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.9rem",
                padding: "1rem",
                border: "1px solid rgba(245, 240, 232, 0.14)",
                background: "rgba(255, 255, 255, 0.035)",
                cursor: isSavingEmailPreference ? "wait" : "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={doNotSendEmail}
                onChange={handleEmailPreferenceChange}
                disabled={
                  isSaving ||
                  isSavingEmailPreference ||
                  isUploadingProfileImage ||
                  isDeleting
                }
                style={{ width: "1.15rem", height: "1.15rem", marginTop: "0.2rem" }}
              />
              <span style={{ display: "grid", gap: "0.25rem" }}>
                <strong style={{ color: "var(--white)" }}>Do not send email</strong>
                <span>
                  Save an opt-out preference on your account for non-essential email. Password
                  resets, payment receipts, and other messages needed to operate your account may
                  still be sent.
                </span>
                {isSavingEmailPreference ? (
                  <span
                    style={{
                      color: "rgba(245, 240, 232, 0.58)",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Saving preference...
                  </span>
                ) : null}
              </span>
            </label>

            <MessageBanner type="error" message={emailPreferenceErrorMessage} />
            <MessageBanner type="success" message={emailPreferenceSuccessMessage} />

            <div
              style={{
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(245, 240, 232, 0.12)",
              }}
            >
              <p style={{ margin: "0 0 0.7rem", color: "var(--white)" }}>
                Deleting your account is permanent and means:
              </p>
              <ul style={{ margin: "0 0 1.25rem", paddingLeft: "1.25rem" }}>
                <li>Your Far Flung Change login and profile will be removed.</li>
                <li>You will lose access to this dashboard and its account tools.</li>
                <li>Your saved email preference will be deleted with your profile.</li>
                <li>
                  Signed agreements may remain in administrative history when they must be retained
                  as business records.
                </li>
              </ul>
            </div>
          </div>

          <MessageBanner type="error" message={deleteErrorMessage} />

          <button
            type="button"
            style={dangerButtonStyle}
            onClick={handleDeleteAccount}
            disabled={
              isSaving ||
              isSavingEmailPreference ||
              isUploadingProfileImage ||
              isDeleting
            }
          >
            {isDeleting ? "Deleting Account..." : "Delete My Account"}
          </button>
        </section>
      </div>
    </main>
  );
}
