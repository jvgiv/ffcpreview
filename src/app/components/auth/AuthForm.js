"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { useAuth } from "./AuthProvider";
import {
  ensureFirebaseUserProfile,
  syncFirebaseUserProfile,
} from "@/lib/firebase/userProfiles";
import { AGE_RANGE_OPTIONS } from "@/lib/firebase/profileOptions";
import { USER_ROLES } from "@/lib/firebase/userRoles";
import styles from "./AuthForm.module.css";


const FORM_COPY = {
  login: {
    eyebrow: "Member Access",
    leadTitle: ["Welcome to", "Orientation."],
    leadCopy:
      "Sign in to pick up where you left off. Your account keeps your orientation details, scorecard access, and progress connected to you.",
    cardKicker: "Login",
    cardTitle: "Sign In",
    cardBody:
      "Use the email and password tied to your account. Once you are in, we will send you to the member page you asked for.",
    buttonLabel: "Log In",
    helperText: "Need an account?",
    helperHref: "/register",
    helperLabel: "Create One",
  },
  register: {
    eyebrow: "Create Your Access",
    leadTitle: ["Start your", "account"],
    leadCopy:
      "Create your account to unlock a more personal experience across the site and keep your information connected to you.",
    cardKicker: "Register",
    cardTitle: "Create Account",
    cardBody:
      "Use an email and password you will remember, then add the details that help us personalize your experience behind the member gates.",
    buttonLabel: "Register",
    helperText: "Already have an account?",
    helperHref: "/login",
    helperLabel: "Log In",
  },
};

const REDIRECT_PAGE_LABELS = [
  {
    match(pathname) {
      return pathname.startsWith("/logged-in/checkout/success");
    },
    label: "payment confirmation",
  },
  {
    match(pathname) {
      return pathname.startsWith("/logged-in/checkout");
    },
    label: "checkout",
  },
  {
    match(pathname) {
      return pathname === "/caddybook";
    },
    label: "Caddy Book",
  },
  {
    match(pathname) {
      return pathname.startsWith("/definitions");
    },
    label: "DogStar Definitions",
  },
  {
    match(pathname) {
      return pathname.startsWith("/logged-in/admin/documents");
    },
    label: "All Signed DocuSign Documents",
  },
  {
    match(pathname) {
      return pathname.startsWith("/logged-in/documents");
    },
    label: "Signed Documents",
  },
  {
    match(pathname) {
      return pathname.startsWith("/logged-in/docusign");
    },
    label: "DocuSign",
  },
  {
    match(pathname) {
      return pathname === "/logged-in";
    },
    label: "your member page",
  },
];

function getSafeRedirectPath(value) {
  if (typeof value !== "string") {
    return "/logged-in";
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("/") || trimmedValue.startsWith("//")) {
    return "/logged-in";
  }

  return trimmedValue || "/logged-in";
}

function buildAuthHelperHref(baseHref, redirectTarget, { loginRequired = false } = {}) {
  if ((!redirectTarget || redirectTarget === "/logged-in") && !loginRequired) {
    return baseHref;
  }

  const params = new URLSearchParams();

  if (redirectTarget && redirectTarget !== "/logged-in") {
    params.set("redirect", redirectTarget);
  }

  if (loginRequired) {
    params.set("loginRequired", "1");
  }

  return `${baseHref}?${params.toString()}`;
}

function getCurrentSearchParams() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search);
}

function formatPageLabelFromSegment(segment) {
  return segment
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRedirectPageLabel(redirectTarget) {
  try {
    const pathname = new URL(redirectTarget, "https://ffc.local").pathname;
    const matchedPage = REDIRECT_PAGE_LABELS.find((entry) => entry.match(pathname));

    if (matchedPage) {
      return matchedPage.label;
    }

    const pathSegments = pathname.split("/").filter(Boolean);

    if (!pathSegments.length) {
      return "this page";
    }

    return formatPageLabelFromSegment(pathSegments[pathSegments.length - 1]);
  } catch {
    return "this page";
  }
}

function buildRedirectNotice(redirectTarget) {
  const pageLabel = getRedirectPageLabel(redirectTarget);

  return `In order to access ${pageLabel}, you need to log in first. Then you will be taken to ${pageLabel}.`;
}

function getFirebaseErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "That email address does not look valid.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/configuration-not-found":
      return "Sign-in is not fully configured yet. Please check the site auth settings and try again.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password was not recognized.";
    case "auth/too-many-requests":
      return "Too many attempts were made. Give it a minute and try again.";
    case "auth/network-request-failed":
      return "We could not reach the sign-in service. Check your connection and try again.";
    default:
      return error?.message || "Something went wrong while signing you in.";
  }
}

async function syncUserProfile(user, profile) {
  if (profile.displayName) {
    await updateProfile(user, { displayName: profile.displayName });
  }

  return syncFirebaseUserProfile(user, {
    ...profile,
    role: USER_ROLES.CLIENT,
  });
}

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const copy = FORM_COPY[mode] ?? FORM_COPY.login;
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const currentSearchParams = getCurrentSearchParams();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    zipCode: "",
    ageRange: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTarget =
    currentSearchParams === null
      ? "/logged-in"
      : getSafeRedirectPath(currentSearchParams.get("redirect"));
  const wasRedirectedToLogin = currentSearchParams?.get("loginRequired") === "1";

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      return;
    }

    router.replace(redirectTarget);
  }, [isAuthenticated, isAuthLoading, redirectTarget, router]);

  if (isAuthLoading || isAuthenticated) {
    return null;
  }

  const helperHref = buildAuthHelperHref(copy.helperHref, redirectTarget, {
    loginRequired: wasRedirectedToLogin,
  });
  const redirectNotice =
    mode === "login" && wasRedirectedToLogin ? buildRedirectNotice(redirectTarget) : "";
  const showRedirectToast = Boolean(redirectNotice);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = formData.email.trim();
    const trimmedName = formData.fullName.trim();
    const trimmedPhoneNumber = formData.phoneNumber.trim();
    const trimmedZipCode = formData.zipCode.trim();

    if (isRegister && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match yet.");
      return;
    }

    if (isRegister && !trimmedName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (isRegister && !trimmedPhoneNumber) {
      setErrorMessage("Please enter a phone number.");
      return;
    }

    if (isRegister && !trimmedZipCode) {
      setErrorMessage("Please enter a zip code.");
      return;
    }

    if (isRegister && !formData.ageRange) {
      setErrorMessage("Please choose an age range.");
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = getFirebaseAuth();

      if (isRegister) {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          formData.password
        );

        try {
          await syncUserProfile(credentials.user, {
            displayName: trimmedName,
            phoneNumber: trimmedPhoneNumber,
            zipCode: trimmedZipCode,
            ageRange: formData.ageRange,
          });
        } catch (profileError) {
          console.error("User document sync failed", profileError);
        }

        setSuccessMessage("Account created. Redirecting...");
      } else {
        const credentials = await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          formData.password
        );

        try {
          await ensureFirebaseUserProfile(credentials.user);
        } catch (profileError) {
          console.error("User document backfill failed", profileError);
        }

        setSuccessMessage("Signed in. Redirecting...");
      }

      router.push(redirectTarget);
      router.refresh();
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.authPage}>
      {showRedirectToast ? (
        <div className={styles.redirectToast} role="status" aria-live="polite">
          {redirectNotice}
        </div>
      ) : null}

      <div className={styles.authShell}>
        <section className={styles.authLead}>
          <div>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <h1 className={styles.headline}>
              {copy.leadTitle[0]}
              <span className={styles.headlineAccent}>{copy.leadTitle[1]}</span>
            </h1>
            <p className={styles.leadCopy}>{copy.leadCopy}</p>
          </div>
        </section>

        <section className={styles.authCard}>
          <div className={styles.cardInner}>
            <p className={styles.cardKicker}>{copy.cardKicker}</p>
            <h2 className={styles.cardTitle}>{copy.cardTitle}</h2>
            <p className={styles.cardBody}>{copy.cardBody}</p>

            <form className={styles.authForm} onSubmit={handleSubmit}>
              {isRegister ? (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    className={styles.fieldInput}
                    name="fullName"
                    type="text"
                    placeholder="Alex Morgan"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              ) : null}

              {isRegister ? (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    className={styles.fieldInput}
                    name="phoneNumber"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                  />
                </div>
              ) : null}

              {isRegister ? (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="zipCode">
                    Zip Code
                  </label>
                  <input
                    id="zipCode"
                    className={styles.fieldInput}
                    name="zipCode"
                    type="text"
                    placeholder="02891"
                    value={formData.zipCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    inputMode="numeric"
                    required
                  />
                </div>
              ) : null}

              {isRegister ? (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="ageRange">
                    Age Range
                  </label>
                  <select
                    id="ageRange"
                    className={styles.fieldInput}
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
                </div>
              ) : null}

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className={styles.fieldInput}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className={styles.fieldInput}
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={6}
                  required
                />
              </div>

              {!isRegister ? (
                <div className={styles.inlineLinkRow}>
                  <Link className={styles.inlineLink} href="/forgot-password">
                    Forgot password?
                  </Link>
                </div>
              ) : null}

              {isRegister ? (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    className={styles.fieldInput}
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              ) : null}

              {errorMessage ? (
                <p className={styles.errorMessage}>{errorMessage}</p>
              ) : null}

              {successMessage ? (
                <p className={styles.successMessage}>{successMessage}</p>
              ) : null}

              <button
                className={styles.submitButton}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Working..." : copy.buttonLabel}
              </button>
            </form>

            <div className={styles.helperRow}>
              <p className={styles.helperText}>{copy.helperText}</p>
              <Link className={styles.helperLink} href={helperHref}>
                {copy.helperLabel}
              </Link>
            </div>

            <Link className={styles.homeLink} href="/">
              Back To Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
