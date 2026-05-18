import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import "../../homepage.css";

export default function Orientation() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.revealCard} reveal`}>
        <div>
          <h1 className={styles.heroTitle}>Guided Orientation</h1>
          <p className={styles.heroSubtitle}>
            Practical Financial Orientation for Growin&apos;Up&apos;s Sake.
          </p>
        </div>

        <div className={styles.sectionCopy}>
          <p>
            Most people don&apos;t need more financial advice. They need a
            starting point.
          </p>
          <p>The financial world is foggy by nature.</p>
          <p>Acronyms multiply. Products accumulate.</p>
          <p>Every conversation seems to end with something to sign.</p>
          <p>Somewhere along the way, a quiet suspicion sets in:</p>
          <p>that everyone else figured this out, and you missed something.</p>
          <p>
            You didn&apos;t miss anything. The fog was never your fault. But it
            is solvable.
          </p>
          <p>
            <strong>Guided Orientation is how Far Flung Change solves it.</strong>
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.revealCard} reveal`} style={{ transitionDelay: "0.08s" }}>
        <p className={styles.sectionHeading}>How it works</p>
        <div className={styles.sectionCopy}>
          <p>
            One flat fee. One idea: <span className={styles.italic}>orientation before
            obligation</span>.
          </p>
          <p>
            The <strong>Caddy Book of Orientation</strong> starts the process before
            the first conversation.
          </p>
          <p>
            Seven elements. About ten minutes. Plain-language prompts that surface
            what&apos;s clear, what&apos;s foggy, and what&apos;s most pressing.
            The notes are yours.
          </p>
          <p className={styles.italic}>
            Context before conversation. Every time.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.revealCard} reveal`} style={{ transitionDelay: "0.12s" }}>
        <p className={styles.sectionHeading}>Orientation ScoreCard</p>
        <div className={styles.sectionCopy}>
          <p>
            The <strong>Orientation ScoreCard</strong> maps eighteen holes of
            financial terrain: nine covering foundational infrastructure, nine
            covering decisions, habits, and values.
          </p>
          <p>
            Not a report card. A living record of attention, updated as fog clears.
          </p>
        </div>
      </section>

      <section id="submit-oq"className={`${styles.callout} ${styles.revealCard} reveal`} style={{ transitionDelay: "0.08s" }}>
        <p className={styles.sectionHeading}>Submit an orientation question</p>
        <div className={styles.definitionBlock}>
          <div className={styles.sectionCopy}>
            <p>Got a question about your financial life? Ask it here.</p>
            <p>No judgment. No sales pitch. No obligation.</p>
            <p>Just a straight answer from a fiduciary-qualified guide.</p>
            <p>Your question goes directly to the Far Flung Change Flight Crew.</p>
            <p>
              We&apos;ll respond by email, then invite you to extend the conversation
              by phone or Zoom, your choice, until you say, &ldquo;enough &mdash; I get it.&rdquo;
            </p>
          </div>
          <div className={styles.definitionAction}>
            <a href="mailto:INSERTEMAILHERE@test.com" className="btn-ghost" rel="noreferrer" target="_blank">
              PLACEHOLDER UNTIL WE FIGURE OUT THE NEW EMAIL
            </a>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.revealCard} reveal`} style={{ transitionDelay: "0.08s" }}>
        <p className={styles.sectionHeading}>Compendium of DogStar Definitions</p>
        <div className={styles.definitionBlock}>
          <p className={styles.sectionCopy}>
            The Compendium of DogStar Definitions gives you the language: 360
            plain-language terms, 18 chapters, expandable with six deeper-dive
            Supplements that define nearly 300 more entries.
          </p>
          <div className={styles.definitionAction}>
            <Link href="/orientation/definitions" className="btn-ghost">
              Explore DogStar Definitions -
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.revealCard} reveal`} style={{ transitionDelay: "0.12s" }}>
        <p className={styles.sectionHeading}>Unlimited orientation support</p>
        <div className={styles.sectionCopy}>
          <p>
            All of it comes with one full year of <strong>Unlimited Orientation
            Questions</strong>, answered at the fiduciary level by phone, Zoom, or
            in person.
          </p>
          <p>No billable hours. No agenda attached to the answer.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.revealCard} reveal`} style={{ transitionDelay: "0.08s" }}>
        <p className={styles.sectionHeading}>Two paths. One destination.</p>
        <div className={styles.pricingGrid}>
          <div className={styles.planCard}>
            <h3>Basic</h3>
            <p className={styles.planPrice}>$500</p>
            <p>
              The Caddy Book, the ScoreCard, the Compendium + Supplements, and one
              year of Unlimited Orientation Q&amp;A.
            </p>
          </div>
          <div className={styles.planCard}>
            <h3>Premium</h3>
            <p className={styles.planPrice}>$750</p>
            <p>
              Everything in Basic, plus dynamic ScoreCard tracking, scheduled
              check-ins, account aggregation, spending consolidation, and goal
              identification.
            </p>
          </div>
          <div className={styles.planCard}>
            <h3>The whole point</h3>
            <p className={styles.planPrice}>&nbsp;</p>
            <p>
              One year. Unlimited Questions. No commissions. No hidden agenda.
            </p>
            <p>
              Just orientation, so you know where you&apos;re standing before you
              take the next step.
            </p>
            <p className={styles.italic}>
              What follows from there is entirely up to you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
