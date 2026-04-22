"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ClientDashboard from "@/app/components/account/ClientDashboard";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { listPurchases } from "@/lib/purchases";
import { USER_ROLES } from "@/lib/firebase/userRoles";

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

const PURCHASE_OPTIONS = listPurchases();

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

function DashboardStat({ label, value }) {
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

function UserInfoRow({ label, value, mono = false }) {
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
      <span
        style={{
          color: "rgba(245, 240, 232, 0.88)",
          lineHeight: 1.6,
          wordBreak: "break-word",
          fontFamily: mono ? "'Space Mono', monospace" : undefined,
          fontSize: mono ? "0.8rem" : undefined,
        }}
      >
        {value || "Not provided"}
      </span>
    </div>
  );
}

function UserCard({ user }) {
  const paymentEntries = PURCHASE_OPTIONS.map((purchase) => ({
    purchase,
    summary: user.paymentSummary?.[purchase.agreementSlug] || null,
  }));

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
        <div>
          <h3 style={{ margin: 0, color: "var(--white)", fontSize: "1.15rem" }}>
            {user.displayName || "Unnamed user"}
          </h3>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: "rgba(245, 240, 232, 0.65)",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.78rem",
            }}
          >
            {user.email || "No email on file"}
          </p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "2rem",
            padding: "0.35rem 0.75rem",
            border: "1px solid rgba(245, 240, 232, 0.16)",
            background:
              user.role === USER_ROLES.ADMIN
                ? "rgba(148, 187, 91, 0.12)"
                : "rgba(245, 197, 24, 0.12)",
            color: user.role === USER_ROLES.ADMIN ? "#eef8dd" : "#fff2bc",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {user.roleLabel}
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <UserInfoRow label="Phone" value={user.phoneNumber} />
        <UserInfoRow label="Zip Code" value={user.zipCode} />
        <UserInfoRow label="Age Range" value={user.ageRange} />
        <UserInfoRow label="Joined" value={formatDate(user.createdAt)} />
        <UserInfoRow label="Last Updated" value={formatDate(user.updatedAt)} />
        <UserInfoRow label="UID" value={user.uid} mono />
      </div>

      <div style={{ display: "grid", gap: "0.8rem" }}>
        <span
          style={{
            color: "rgba(245, 240, 232, 0.55)",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Payment Status
        </span>
        <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {paymentEntries.map(({ purchase, summary }) => {
            const isPaid = Boolean(summary?.isPaid);

            return (
              <div
                key={purchase.agreementSlug}
                style={{
                  border: "1px solid rgba(245, 240, 232, 0.12)",
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "0.95rem",
                  display: "grid",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    alignItems: "start",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ color: "var(--white)", lineHeight: 1.5 }}>
                    {purchase.displayName}
                  </strong>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "1.8rem",
                      padding: "0.3rem 0.65rem",
                      border: isPaid
                        ? "1px solid rgba(148, 187, 91, 0.36)"
                        : "1px solid rgba(245, 240, 232, 0.16)",
                      background: isPaid
                        ? "rgba(148, 187, 91, 0.12)"
                        : "rgba(245, 240, 232, 0.06)",
                      color: isPaid ? "#eef8dd" : "rgba(245, 240, 232, 0.92)",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.64rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {summary?.statusLabel || "Not started"}
                  </span>
                </div>
                <span style={{ color: "rgba(245, 240, 232, 0.7)", lineHeight: 1.6 }}>
                  {summary?.priceLabel || purchase.priceLabel}
                </span>
                <span style={{ color: "rgba(245, 240, 232, 0.62)", lineHeight: 1.6 }}>
                  {summary?.completedAt
                    ? `Paid ${formatDate(summary.completedAt)}`
                    : summary?.updatedAt
                      ? `Updated ${formatDate(summary.updatedAt)}`
                      : "No payment activity yet"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function AdminDashboard({ authUser, displayName, roleLabel }) {
  const [dashboard, setDashboard] = useState({
    isLoading: true,
    errorMessage: "",
    users: [],
    metrics: null,
  });

  useEffect(() => {
    if (!authUser) {
      return undefined;
    }

    let isActive = true;

    async function loadDashboard() {
      setDashboard((currentState) => ({
        ...currentState,
        isLoading: true,
        errorMessage: "",
      }));

      try {
        const idToken = await authUser.getIdToken();
        const response = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load the admin dashboard.");
        }

        if (!isActive) {
          return;
        }

        setDashboard({
          isLoading: false,
          errorMessage: "",
          users: Array.isArray(data.users) ? data.users : [],
          metrics: data.metrics || null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setDashboard({
          isLoading: false,
          errorMessage: error.message || "Unable to load the admin dashboard.",
          users: [],
          metrics: null,
        });
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [authUser]);

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
            Admin Home
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
            Welcome, {displayName || "Admin"}
          </h1>
          <p style={{ color: "rgba(245, 240, 232, 0.75)", lineHeight: 1.8, margin: 0 }}>
            Signed in as <strong style={{ color: "var(--white)" }}>{roleLabel}</strong>. This
            dashboard gives you a quick operational view of signed DocuSign activity and the user
            accounts currently stored in Firestore.
          </p>
        </section>

        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <DashboardStat
            label="Total Users"
            value={dashboard.metrics?.totalUsers ?? (dashboard.isLoading ? "..." : 0)}
          />
          <DashboardStat
            label="Admins"
            value={dashboard.metrics?.adminCount ?? (dashboard.isLoading ? "..." : 0)}
          />
          <DashboardStat
            label="Clients"
            value={dashboard.metrics?.clientCount ?? (dashboard.isLoading ? "..." : 0)}
          />
          <DashboardStat
            label="Signed Docs"
            value={dashboard.metrics?.signedDocumentsCount ?? (dashboard.isLoading ? "..." : 0)}
          />
          <DashboardStat
            label="Paid Packages"
            value={dashboard.metrics?.paidPackageCount ?? (dashboard.isLoading ? "..." : 0)}
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
            Admin Actions
          </h2>
          <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            Review every signed DocuSign record across the system or jump back to the public site.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
            <Link href="/logged-in/admin/documents" style={primaryButtonStyle}>
              View All Signed DocuSign Documents
            </Link>
            <Link href="/" style={secondaryButtonStyle}>
              Back Home
            </Link>
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
            Users
          </h2>
          <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            A quick list of user records with the most useful account details for administrative follow-up.
          </p>

          {dashboard.isLoading ? (
            <p
              style={{
                margin: 0,
                padding: "0.95rem 1rem",
                border: "1px solid rgba(245, 240, 232, 0.14)",
                background: "rgba(245, 240, 232, 0.05)",
                color: "rgba(245, 240, 232, 0.85)",
                lineHeight: 1.7,
              }}
            >
              Loading admin dashboard...
            </p>
          ) : null}

          {!dashboard.isLoading && dashboard.errorMessage ? (
            <p
              style={{
                margin: 0,
                padding: "0.95rem 1rem",
                border: "1px solid rgba(206, 66, 43, 0.45)",
                background: "rgba(206, 66, 43, 0.12)",
                color: "#ffd8cf",
                lineHeight: 1.7,
              }}
            >
              {dashboard.errorMessage}
            </p>
          ) : null}

          {!dashboard.isLoading && !dashboard.errorMessage && !dashboard.users.length ? (
            <p
              style={{
                margin: 0,
                padding: "0.95rem 1rem",
                border: "1px solid rgba(245, 240, 232, 0.14)",
                background: "rgba(245, 240, 232, 0.05)",
                color: "rgba(245, 240, 232, 0.85)",
                lineHeight: 1.7,
              }}
            >
              No user records are available yet.
            </p>
          ) : null}

          {!dashboard.isLoading && !dashboard.errorMessage && dashboard.users.length ? (
            <div style={{ display: "grid", gap: "1rem" }}>
              {dashboard.users.map((user) => (
                <UserCard key={user.uid} user={user} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default function LoggedInPage() {
  const { authUser, profile, refreshProfile, role, roleLabel } = useAuth();
  const displayName = profile?.displayName || authUser?.displayName || authUser?.email || "friend";

  if (role === USER_ROLES.ADMIN) {
    return <AdminDashboard authUser={authUser} displayName={displayName} roleLabel={roleLabel} />;
  }

  return (
    <ClientDashboard
      authUser={authUser}
      profile={profile}
      roleLabel={roleLabel}
      displayName={displayName}
      refreshProfile={refreshProfile}
    />
  );
}
