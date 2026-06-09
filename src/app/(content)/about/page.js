import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

const audience = [
  "finding your footing with money matters",
  "recalibrating what you thought you knew about personal finance",
  "navigating a financial transition that feels like unfamiliar terrain",
];

const principles = [
  {
    title: "Clarity First",
    body: "We translate financial concepts into plain language so people can orient themselves before they make bigger decisions.",
  },
  {
    title: "Presently Practical",
    body: "The work is meant to reduce confusion, build confidence, and help people understand what matters now. We scout the course. You play the round.",
  },
  {
    title: "Core Credibility",
    body: "As fiduciaries, our guidance is led by loyalty, care, and mastery — so our Orienteers can make choices that empower them. Never us.",
  },
];

export default function About() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroCopy} ${styles.revealCard} reveal`}>
          <p className={styles.eyebrow}>About Far Flung Change</p>
          {/* <h1 className={styles.title}>
            Financial orientation<span>for Growin&apos;Ups&apos; Sake.</span>
          </h1> */}
          <Image
            src="/pfo.png"
            alt="practical financial orientation"
            width={599}
            height={104}
            style={{ width: "100%", height: "auto", maxWidth: "599px" }}
          />
          <div style={{ margin: "0 auto" }}>
            <Image
              src="/ffcfgus.png"
              alt="for Growin'up's sake"
              width={358}
              height={100}
            />
          </div>
          <p className={styles.lead}>
            Far Flung Change provides honest, practical financial orientation
            for people who want firmer footing before the terrain gets harder to
            read.
          </p>
        </div>

        <aside
          className={`${styles.heroPanelWhatThisIs} ${styles.revealCard} reveal`}
          style={{ transitionDelay: "0.12s" }}
        >
          <p className={styles.panelLabel}>What this is</p>
          <p className={styles.panelBody}>
            A grounded starting point for understanding money decisions,
            financial systems, and the next right move.
            <br />
            No jargon. No agenda. Just orientation.
          </p>
          
          <p className={styles.panelLabel}>Who this is for</p>
          <p className={styles.panelBody}>For people who want Clarity.  Not Complexity.</p>
        </aside>
      </section>

      <section className={styles.grid}>
        <article className={`${styles.storyCard} ${styles.revealCard} reveal`}>
          <p className={styles.sectionLabel}>Why it exists</p>
          <p className={styles.storyText}>
            Too many people are expected to act like fully formed adults in a
            financial world they were never properly introduced to. Far Flung
            Change exists to make that introduction useful, direct, and usable.
          </p>
          <p className={styles.storyText}>
            The Orientation Program is designed to help people build context,
            move forward with less friction, and arrive at bigger decisions with
            more confidence.
          </p>
        </article>

        <article
          className={`${styles.audienceCard} ${styles.revealCard} reveal`}
          style={{ transitionDelay: "0.12s" }}
        >
          <p className={styles.sectionLabel}>Especially helpful for</p>
          <ul className={styles.audienceList}>
            {audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
      <section className={styles.rosterSection}>
        <article className={`${styles.storyCard} ${styles.revealCard} reveal`}>
          <p className={styles.sectionLabel}>Captaining our roster</p>
          <h3 className={styles.titleRoster}>
              ATTENTIVE{" "}
            <span
              style={{
                color: "var(--red)",
                // fontStyle: "italic",
                letterSpacing: "0.04em",
              }}
            >
            COURSE PROS
            </span>
          </h3>
          <p className={styles.storyText}>
            At <span style={{ fontWeight: "bold" }}>FAR FLUNG CHANGE</span>, you
            get a sharp team shaped by decades of keen practice and action, on
            and off the fairways, led by Matty the Financial Caddy and Pete the
            GreensKeeper.
          </p>
          <div className={styles.rosterGrid}>
            <div className={`${styles.memberCard} ${styles.revealCard} reveal`}>
              <p className={styles.memberName}>Matty the Financial Caddy</p>
              <Image
                src="/headshots/matty.png"
                alt="Matty the Financial Caddy"
                width={323}
                height={323}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div
              className={`${styles.memberCard} ${styles.revealCard} reveal`}
              style={{ transitionDelay: "0.1s" }}
            >
              <p className={styles.memberName}>Pete the GreensKeeper</p>
              <Image
                src="/headshots/pete.png"
                alt="Pete the GreensKeeper"
                width={323}
                height={323}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <p className={styles.storyText}>
            Our crew brings the{" "}
            <span style={{ fontWeight: "bold", color: "var(--red)" }}>
              BALANCE
            </span>{" "}
            every strong roster needs : eyes wide-open on the holes ahead,
            customized service, and solid support that keeps you steady as each
            round twists and turns.
          </p>
          <p className={styles.storyText}>
            Many Strengths. Many Roles. One Shared{" "}
            <span style={{ fontWeight: "bold", color: "var(--red)" }}>
              PURPOSE
            </span>
            .
          </p>
        </article>
      </section>

      <section className={`${styles.principlesSection} reveal`}>
        <p className={styles.sectionLabel}>What shapes the work</p>
        <div className={styles.principlesGrid}>
          {principles.map((item, index) => (
            <article
              key={item.title}
              className={`${styles.principleCard} ${styles.revealCard} reveal`}
              style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
            >
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className={`${styles.finalCta} ${styles.revealCard} reveal`}>
          <p className={styles.sectionLabel}>Try Far Flung Change</p>
          <h2 className={styles.finalCtaTitle}>Your round is not over. Yet.</h2>
          <p className={styles.finalCtaBody}>
            See what orientation looks like before you commit to anything.
          </p>
          <div className={styles.finalCtaActions}>
            <a
              href="/files/agreement.pdf"
              target="_blank"
              className={styles.ctaPrimary}
            >
              View Agreement -&gt;
            </a>
            <Link href="/#scorecard" className={styles.ctaGhost}>
              Free ScoreCard First
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
