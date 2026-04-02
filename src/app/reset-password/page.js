"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import styles from "@/app/components/auth/AuthForm.module.css";

function getResetErrorMessage(error) {
  switch (error?.code) {
    case "auth/expired-action-code":
      return "This reset link has expired. Request a new one and try again.";
    case "auth/invalid-action-code":
      return "This reset link is invalid or has already been used.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/network-request-failed":
      return "We could not reach the reset service. Check your connection and try again.";
    default:
      return error?.message || "We could not reset the password right now.";
  }
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  useEffect(() => {
    async function verifyCode() {
      if (!oobCode) {
        setErrorMessage("This reset link is missing its verification code. Please request a new reset email.");
        setIsVerifying(false);
        return;
      }

      try {
        const verifiedEmail = await verifyPasswordResetCode(getFirebaseAuth(), oobCode);
        setEmail(verifiedEmail);
        setIsCodeValid(true);
      } catch (error) {
        setErrorMessage(getResetErrorMessage(error));
      } finally {
        setIsVerifying(false);
      }
    }

    verifyCode();
  }, [oobCode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!oobCode) {
      setErrorMessage("This reset link is missing its verification code. Please request a new reset email.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
      setSuccessMessage("Password updated. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      setErrorMessage(getResetErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.authShell}>
        <section className={styles.authLead}>
          <div>
            <span className={styles.eyebrow}>Choose A New Password</span>
            <h1 className={styles.headline}>
              Reset your
              <span className={styles.headlineAccent}>access</span>
            </h1>
            <p className={styles.leadCopy}>
              This page verifies the one-time reset code from your email, then lets you choose a new password.
            </p>
          </div>


        </section>

        <section className={styles.authCard}>
          <div className={styles.cardInner}>
            <p className={styles.cardKicker}>Reset Password</p>
            <h2 className={styles.cardTitle}>Choose New Password</h2>
            <p className={styles.cardBody}>
              {email ? `Resetting password for ${email}.` : "Use the reset link from your email to continue."}
            </p>

            {isVerifying ? (
              <p className={styles.successMessage}>Verifying your reset link...</p>
            ) : null}

            {!isVerifying && isCodeValid ? (
              <form className={styles.authForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    className={styles.fieldInput}
                    name="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>

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
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>

                {errorMessage ? (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                ) : null}

                {successMessage ? (
                  <p className={styles.successMessage}>{successMessage}</p>
                ) : null}

                <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Reset Password"}
                </button>
              </form>
            ) : null}

            {!isVerifying && !isCodeValid && errorMessage ? (
              <p className={styles.errorMessage}>{errorMessage}</p>
            ) : null}

            <div className={styles.helperRow}>
              <p className={styles.helperText}>Need another link?</p>
              <Link className={styles.helperLink} href="/forgot-password">
                Request Again
              </Link>
            </div>

            <Link className={styles.homeLink} href="/login">
              Back To Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

