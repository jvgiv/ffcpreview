import React from 'react'
import styles from './page.module.css'
import '../../homepage.css'

const audience = [
  'just getting started with money matters',
  'looking to recalibrate their understanding of personal finance',
  'navigating a financial transition that feels unfamiliar',
]

const principles = [
  {
    title: 'Clarity First',
    body: 'We translate financial concepts into plain language so people can orient themselves before they make bigger decisions.',
  },
  {
    title: 'Practical Over Performative',
    body: 'The work is meant to reduce confusion, build confidence, and help people understand what matters now.',
  },
  {
    title: 'Built On Experience',
    body: 'Far Flung Change is the education and orientation division of First Financial Advisory Services, Inc., a Registered Investment Advisor established in 1974.',
  },
]

export default function About() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroCopy} ${styles.revealCard} reveal`}>
          <p className={styles.eyebrow}>About Far Flung Change</p>
          <h1 className={styles.title}>
            Financial orientation for <span>Growin&apos;Ups&apos; Sake.</span>
          </h1>
          <p className={styles.lead}>
            Far Flung Change provides clear, practical financial orientation for
            people who want firmer footing before the stakes get higher.
          </p>
        </div>

        <aside
          className={`${styles.heroPanel} ${styles.revealCard} reveal`}
          style={{ transitionDelay: '0.12s' }}
        >
          <p className={styles.panelLabel}>What this is</p>
          <p className={styles.panelBody}>
            A grounded starting point for understanding money decisions,
            financial systems, and the next right move.
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
            recognize what they do not yet know, and move forward with less
            friction.
          </p>
        </article>

        <article
          className={`${styles.audienceCard} ${styles.revealCard} reveal`}
          style={{ transitionDelay: '0.12s' }}
        >
          <p className={styles.sectionLabel}>Especially useful for</p>
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
  )
}
