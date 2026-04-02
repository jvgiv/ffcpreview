"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import styles from "@/app/components/auth/AuthForm.module.css";

function getForgotPasswordErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "That email address does not look valid.";
    case "auth/missing-email":
      return "Please enter the email tied to your account.";
    case "auth/too-many-requests":
      return "Too many attempts were made. Give it a minute and try again.";
    case "auth/network-request-failed":
      return "We could not reach the reset service. Check your connection and try again.";
    default:
      return error?.message || "We could not send the reset email right now.";
  }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      setSuccessMessage(
        "Password reset email sent. Check your inbox and follow the link to continue."
      );
      setEmail("");
    } catch (error) {
      setErrorMessage(getForgotPasswordErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.authShell}>
        <section className={styles.authLead}>
          <div>
            <span className={styles.eyebrow}>Password Reset</span>
            <h1 className={styles.headline}>
              Find your
              <span className={styles.headlineAccent}>way back</span>
            </h1>
            <p className={styles.leadCopy}>
              Enter the email address tied to your account and we will send a password reset link.
            </p>
          </div>


        </section>

        <section className={styles.authCard}>
          <div className={styles.cardInner}>
            <p className={styles.cardKicker}>Forgot Password</p>
            <h2 className={styles.cardTitle}>Reset Link</h2>
            <p className={styles.cardBody}>
              We will email you a reset link. Open that message, follow the secure code, and choose a new password.
            </p>

            <form className={styles.authForm} onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
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
                {isSubmitting ? "Sending..." : "Email Reset Link"}
              </button>
            </form>

            <div className={styles.helperRow}>
              <p className={styles.helperText}>Remembered it?</p>
              <Link className={styles.helperLink} href="/login">
                Back To Login
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

