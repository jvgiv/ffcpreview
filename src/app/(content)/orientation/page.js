import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import "../../homepage.css";

export default function Orientation() {
  return (
    <main className={styles.page}>
      <section
        id="guided-orientation"
        className={`${styles.hero} ${styles.revealCard} reveal`}
      >
        <div>
          <h1 className={styles.heroTitle}>
            Guided <span style={{ color: "var(--red)" }}>Orientation</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Practical Financial Orientation for Growin&apos;Up&apos;s Sake.
          </p>
        </div>
        <span className="orientation-line"></span>
        <div className={styles.sectionCopy}>
          <p>
            Most people don&apos;t need more financial advice. They need a
            starting point.
          </p>
          <br />
          <p>
            The financial world is foggy by nature. Acronyms multiply. Products
            accumulate. Every conversation seems to end with something to sign.
          </p>
          <br />
          <p>
            Somewhere along the way, a quiet suspicion sets in: that everyone
            else figured this out, and you missed something.
          </p>
          <br />
          <p>
            You didn&apos;t miss anything. The fog was never your fault. But it
            is solvable.{" "}
            <strong>
              Guided Orientation is how Far Flung Change solves it.
            </strong>
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className={`${styles.section} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.08s" }}
      >
        <p className={styles.sectionHeading}>How it works</p>
        <span className="orientation-line"></span>
        <div className={styles.sectionCopy}>
          <p>
            One flat fee. One idea:{" "}
            <span className={styles.italic}>orientation before obligation</span>
            .
          </p>
          <br />
          <p>
            The <strong>Caddy Book of Orientation</strong> starts the process
            before the first conversation.
          </p>
          <br />
          <p>
            Seven elements. About ten minutes. Plain-language prompts that
            surface what&apos;s clear, what&apos;s foggy, and what&apos;s most
            pressing.
          </p>
          <br />
          <p>
            {" "}
            The notes are yours.{"  "}
            <span className={styles.italic}>
              Context before conversation. Every time.
            </span>
          </p>
          <br />
          <div className={styles.btnRow}>
            <a
              href="/files/agreement.pdf"
              target="_blank"
              className="btn-ghost"
            >
              View Agreement
            </a>
            <Link
              href="/logged-in/#member-access"
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "1.1rem 2.5rem" }}
            >
              Choose a Plan -&gt;
            </Link>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.12s" }}
      >
        <p className={styles.sectionHeading}>Orientation ScoreCard</p>
        <span className="orientation-line"></span>
        <div className={styles.sectionCopy}>
          <p>
            The <strong>Orientation ScoreCard</strong> maps eighteen holes of
            financial terrain: nine covering foundational infrastructure, nine
            covering decisions, habits, and values.
          </p>
          <br />
          <p>
            Not a report card. A living record of attention, updated as fog
            clears.
          </p>
        </div>
      </section>

      <section
        id="submit-oq"
        className={`${styles.callout} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.08s" }}
      >
        <p className={styles.sectionHeading}>Submit an orientation question</p>
        <span className="orientation-line"></span>
        <div className={styles.definitionBlock}>
          <div className={styles.sectionCopy}>
            <p>Got a question about your financial life? Ask it here.</p>
            <p>
              No judgment. No sales pitch. No obligation. Just a straight answer
              from a fiduciary-qualified guide.
            </p>
            <p>
              Your question goes directly to the Far Flung Change Flight Crew.
              We&apos;ll respond by email, then invite you to extend the
              conversation by phone or Zoom, your choice, until you say
              you&apos;ve got it
            </p>
          </div>
          <div className={styles.definitionAction}>
            <a
              href="mailto:deliberate@FarFlungChange.com"
              className="btn-ghost"
              rel="noreferrer"
              target="_blank"
            >
              SUBMIT YOUR ORIENTATION QUESTION -&gt;
            </a>
          </div>
        </div>
      </section>

      <section
        id="continue-conversation"
        className={`${styles.callout} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.08s" }}
      >
        <p className={styles.sectionHeading}>Call your Flight Crew</p>
        <span className="orientation-line"></span>
        <div className={styles.definitionBlock}>
          <div className={styles.sectionCopy}>
            <p>
              Your questions don't have to wait for a written reply. Pick a time
              and let's talk through where you are + what you see so we
              can address what you want to know + where you want to go.
            </p>
          </div>
          <div className={styles.definitionAction}>
            <a
              href="https://calendly.com/its-about-time"
              className="btn-primary"
              rel="noreferrer"
              target="_blank"
            >
              LET'S CONNECT
            </a>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.08s" }}
      >
        <p className={styles.sectionHeading}>
          Compendium of DogStar Definitions
        </p>
        <span className="orientation-line"></span>
        <div className={styles.definitionBlock}>
          <p className={styles.sectionCopy}>
            Finance has its own language, and not knowing it puts you at a
            disadvantage before the conversation even starts. The Compendium of
            DogStar Definitions changes that: 360 plain-language terms across 18
            chapters, expandable with six deeper-dive Supplements covering
            nearly 300 more entries.
          </p>
          <br />
          <p>
            The fog lifts faster when you have the words for what you&apos;re
            looking at.
          </p>
          <div className={styles.definitionAction}>
            <Link href="/orientation/definitions" className="btn-ghost">
              Explore DogStar Definitions -&gt;
            </Link>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.12s" }}
      >
        <p className={styles.sectionHeading}>Unlimited orientation support</p>
        <span className="orientation-line"></span>
        <div className={styles.sectionCopy}>
          <p>
            All of it comes with one full year of {/* <strong> */}
            Unlimited Orientation Questions
            {/* </strong> */}, answered at the fiduciary level by phone, Zoom,
            or in person.
          </p>
          <br />
          <p>
            No billable hours. No agenda attached to the answer. Just the
            clarity you came for.
          </p>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.revealCard} reveal`}
        style={{ transitionDelay: "0.08s" }}
      >
        <p className={styles.sectionHeading}>Two paths. One destination.</p>
        <div className={styles.pricingGrid}>
          <div className={styles.planCard}>
            <h3>Basic</h3>
            <p className={styles.planPrice}>$500</p>
            <p>
              The Caddy Book, the ScoreCard, the Compendium + Supplements, and
              one year of Unlimited Orientation Q&amp;A.
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
            <h3>The Real Deal</h3>
            <p className={styles.planPrice}>PRICELESS</p>
            <p>
              One year. Unlimited Questions. No commissions. No hidden agenda.
            </p>
            <p>
              Just orientation: know where you&apos;re standing before you take
              the next step. The fog clears. The picture sharpens. What follows
              from there is entirely up to you.
            </p>
            {/* <p className={styles.italic}>
              What follows from there is entirely up to you.
            </p> */}
          </div>
        </div>
      </section>
    </main>
  );
}
