import React from "react";
import styles from "./page.module.css";
import "../../homepage.css";
import Image from "next/image";

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
    title: "Practicality",
    body: "The work is meant to reduce confusion, build confidence, and help people understand what matters now.",
  },
  {
    title: "Built On Experience",
    body: "Far Flung Change is the education and orientation division of First Financial Advisory Services, Inc., a Registered Investment Advisor established in 1974.",
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
          <div style={{ margin: '0 auto'}}>

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
          className={`${styles.heroPanelWhat} ${styles.revealCard} reveal`}
          style={{ transitionDelay: "0.12s" }}
        >
          <p className={styles.panelLabel}>What this is</p>
          <p className={styles.panelBody}>
            A grounded starting point for understanding money decisions,
            financial systems, and the next right move. No jargon. No agenda.
            Just orientation.
          </p>
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
    </main>
  );
}
