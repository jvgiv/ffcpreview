"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { AGE_RANGE_OPTIONS } from "@/lib/firebase/profileOptions";
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

function DashboardStat({ label, value, copy }) {
  return (
    <article
      style={{
        border: "1px solid rgba(245, 240, 232, 0.12)",
        background: "rgba(10, 10, 10, 0.88)",
        padding: "1.25rem",
        display: "grid",
        gap: "0.45rem",
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
      <p style={{ margin: 0, color: "rgba(245, 240, 232, 0.66)", lineHeight: 1.7 }}>{copy}</p>
    </article>
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
  const actionStyle = item.isPrimary ? primaryButtonStyle : secondaryButtonStyle;

  return (
    <article
      style={{
        border: "1px solid rgba(245, 240, 232, 0.12)",
        background: "rgba(12, 12, 12, 0.9)",
        padding: "1.2rem",
        display: "grid",
        gap: "0.9rem",
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

      {item.isDownload ? (
        <a href={item.href} download style={actionStyle}>
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
  roleLabel,
  displayName,
  refreshProfile,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(() => buildFormState(profile, authUser));
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const paymentSummary = profile?.paymentSummary || {};
  const purchasedProgramCount = PROGRAM_ACCESS.filter((purchase) =>
    isPaymentComplete(paymentSummary?.[purchase.agreementSlug]?.status)
  ).length;
  const memberAccessItems = [
    ...PROGRAM_ACCESS.map((purchase) => {
      const summary = paymentSummary?.[purchase.agreementSlug] || null;
      const isPurchased = isPaymentComplete(summary?.status);

      return {
        title: purchase.displayName,
        description: isPurchased
          ? "Your agreement and payment are already tied to this program. Reopen the checkout page any time to review status."
          : "Available from your member account whenever you are ready to start the sign-and-pay flow.",
        meta: isPurchased
          ? summary?.completedAt
            ? `Purchased on ${new Date(summary.completedAt).toLocaleDateString("en-US")}`
            : "Purchased and active"
          : `${purchase.priceLabel} flat-fee access`,
        href: `/logged-in/checkout?agreement=${purchase.agreementSlug}`,
        ctaLabel: isPurchased ? "View Program Status" : "Start Checkout",
        badgeLabel: isPurchased ? "Purchased" : "Available",
        badgeTone: isPurchased ? "success" : "accent",
        isPrimary: !isPurchased,
      };
    }),
    {
      title: "DogStar Definitions",
      description:
        "Browse the definitions library so concepts, terms, and trade-offs stay within easy reach.",
      meta: "Included member resource",
      href: "/definitions",
      ctaLabel: "Open Definitions",
      badgeLabel: "Included",
      badgeTone: "success",
      isPrimary: false,
    },
    {
      title: "Thought Gallery",
      description:
        "Revisit writing and perspective pieces that support the broader Far Flung Change philosophy.",
      meta: "Included member resource",
      href: "/thoughtgallery",
      ctaLabel: "Open Thought Gallery",
      badgeLabel: "Included",
      badgeTone: "success",
      isPrimary: false,
    },
    {
      title: "Free Caddy Book + ScoreCard",
      description:
        "Download the Caddy Book and ScoreCard PDF again anytime from your account home.",
      meta: "Included member download",
      href: "/files/CaddyBook.pdf",
      ctaLabel: "Download PDF",
      badgeLabel: "Included",
      badgeTone: "success",
      isPrimary: false,
      isDownload: true,
    },
    {
      title: "Signed Documents",
      description:
        "Review the agreements already connected to your account and reopen stored PDFs when needed.",
      meta: "Account-linked member tool",
      href: "/logged-in/documents",
      ctaLabel: "View Signed Documents",
      badgeLabel: "Member Tool",
      badgeTone: "default",
      isPrimary: false,
    },
  ];
  const includedResourceCount = memberAccessItems.filter(
    (item) => item.badgeLabel === "Included" || item.badgeLabel === "Member Tool"
  ).length;

  useEffect(() => {
    setFormData(buildFormState(profile, authUser));
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

  async function handleDeleteAccount() {
    if (!authUser || isDeleting) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete your account? This removes your login and profile details and cannot be undone."
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
              color: "var(--red-hot)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
            }}
          >
            Client Home
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
            Welcome, {displayName || "Client"}
          </h1>
          <p style={{ color: "rgba(245, 240, 232, 0.75)", lineHeight: 1.8, margin: 0 }}>
            Signed in as <strong style={{ color: "var(--white)" }}>{roleLabel}</strong>. This
            page is your member home, with direct access to the resources, documents, and program
            paths connected to your login.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <DashboardStat
            label="Member Access"
            value={memberAccessItems.length}
            copy="Distinct resources and program paths you can jump into from this page."
          />
          <DashboardStat
            label="Included Resources"
            value={includedResourceCount}
            copy="Always available with your logged-in account."
          />
          <DashboardStat
            label="Active Programs"
            value={purchasedProgramCount}
            copy="Packages already purchased and tied to your account."
          />
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
            Your Member Access
          </h2>
          <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            Everything below is reachable because you are signed in. Use this page as the single
            jump-off point for what your account includes right now.
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
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <SummaryRow label="Full Name" value={profile?.displayName || authUser?.displayName} />
              <SummaryRow label="Sign-In Email" value={profile?.email || authUser?.email} />
              <SummaryRow label="Phone Number" value={profile?.phoneNumber || authUser?.phoneNumber} />
              <SummaryRow label="Zip Code" value={profile?.zipCode} />
              <SummaryRow label="Age Range" value={profile?.ageRange} />
              <SummaryRow label="Account Type" value={roleLabel} />
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
              <Link href="/logged-in/checkout" style={secondaryButtonStyle}>
                View Checkout Options
              </Link>
              <Link href="/agreements" style={secondaryButtonStyle}>
                Review Agreements
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
            Keep your name and contact details current so the member experience stays tied to the
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
                  style={fieldInputStyle}
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleChange}
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
              <button type="submit" style={inlineButtonStyle} disabled={isSaving || isDeleting}>
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
              color: "#ffd8cf",
            }}
          >
            Danger Zone
          </h2>
          <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            Deleting your account removes your login and profile details. Signed DocuSign records
            already captured by the system may still remain in administrative history.
          </p>

          <MessageBanner type="error" message={deleteErrorMessage} />

          <button
            type="button"
            style={dangerButtonStyle}
            onClick={handleDeleteAccount}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? "Deleting Account..." : "Delete My Account"}
          </button>
        </section>
      </div>
    </main>
  );
}
