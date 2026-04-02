'use client'
import React from 'react'
import GameTheory from '@/app/components/GameTheory'
import styles from './page.module.css'
import '../../homepage.css'

export default function ThoughtGallery() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroCopy} ${styles.revealCard} reveal`}>
          <p className={styles.eyebrow}>Thought Gallery</p>
          <h1 className={styles.title}>
            Visual prompts for <span>deliberate thinking.</span>
          </h1>
          <p className={styles.lead}>
            A running gallery of visual frames, sharp questions, and conceptual
            sketches that support the broader Far Flung Change point of view.
          </p>
        </div>

        <aside
          className={`${styles.heroPanel} ${styles.revealCard} reveal`}
          style={{ transitionDelay: '0.12s' }}
        >
          <p className={styles.panelLabel}>How to use it</p>
          <p className={styles.panelBody}>
            Browse the boards, open any image for a closer read, and treat the
            gallery as a place to notice patterns rather than collect answers.
          </p>
        </aside>
      </section>

      <section
        className={`${styles.gallerySection} ${styles.revealCard} reveal`}
        style={{ transitionDelay: '0.18s' }}
      >
        <div className={`${styles.galleryIntro} reveal`} style={{ transitionDelay: '0.24s' }}>
          <p className={styles.sectionLabel}>Current collection</p>
          <p className={styles.sectionCopy}>
            This set focuses on Game Theory: image-led prompts meant to surface
            incentives, tradeoffs, and the quiet logic hiding under everyday
            decisions.
          </p>
        </div>

        <GameTheory />
      </section>
    </main>
  )
}
