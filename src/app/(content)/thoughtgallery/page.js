'use client'
import React from 'react'
import ThoughtGalleryLightbox from '@/app/components/ThoughtGalleryLightbox'
import styles from './page.module.css'
import '../../homepage.css'

let gameTheoryImages = [
    { src: '/GT.1.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.2.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.3.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.4.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.5.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.6.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.7.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.8.png', alt: '', width: 1500, height: 1500 },
    { src: '/GT.9.jpg', alt: '', width: 1500, height: 1500 },
]

let movieNightImages = [
    { src: '/mn.png', alt: '', width: 1500, height: 1500 },
    { src: '/mn1.png', alt: '', width: 1500, height: 1500 },
    { src: '/mn2.png', alt: '', width: 1500, height: 1500 },
    { src: '/mn3.png', alt: '', width: 1500, height: 1500 },
    { src: '/mn4.jpg', alt: '', width: 1500, height: 1500 },
    { src: '/mn5.png', alt: '', width: 1500, height: 1500 },
    { src: '/mn6.png', alt: '', width: 3000, height: 3000 },
    { src: '/mn7.jpg', alt: '', width: 1500, height: 1500 },
    { src: '/mn8.png', alt: '', width: 1500, height: 1500 }
]

let oriMattImages = [
    { src: '/om1.png', alt: '', width: 1500, height: 1500 },
    { src: '/om2.png', alt: '', width: 1500, height: 1500 },
    { src: '/om3.png', alt: '', width: 1500, height: 1500 },
    { src: '/allin1.png', alt: '', width: 1500, height: 1500 }
]

let fogSeriesImages = [
    { src: '/fs1.png', alt: '', width: 1500, height: 1500 },
    { src: '/fs2.png', alt: '', width: 1500, height: 1500 },
    { src: '/fs3.jpg', alt: '', width: 1500, height: 1500 },
    { src: '/fs4.png', alt: '', width: 1500, height: 1500 },
    { src: '/fs5.png', alt: '', width: 1500, height: 1500 }
]


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

        <ThoughtGalleryLightbox 
          images={gameTheoryImages} 
          title="Game Theory"
        />
      </section>


       <section
        className={`${styles.gallerySection} ${styles.revealCard} reveal`}
        style={{ transitionDelay: '0.18s' }}
      >
        <div className={`${styles.galleryIntro} reveal`} style={{ transitionDelay: '0.24s' }}>
          <p className={styles.sectionLabel}>Current collection</p>
          <p className={styles.sectionCopy}>
            NEED TEXT HERE
          </p>
          </div>

        <ThoughtGalleryLightbox 
          images={oriMattImages} 
          title="Come on Up to the House"
        />
        </section>


       <section
        className={`${styles.gallerySection} ${styles.revealCard} reveal`}
        style={{ transitionDelay: '0.18s' }}
      >
        <div className={`${styles.galleryIntro} reveal`} style={{ transitionDelay: '0.24s' }}>
          <p className={styles.sectionLabel}>Current collection</p>
          <p className={styles.sectionCopy}>
            NEED FOG TEXT HERE
          </p>
          </div>

        <ThoughtGalleryLightbox 
          images={fogSeriesImages} 
          title="Fog Bank"
        />
        </section>
       
       
       <section
        className={`${styles.gallerySection} ${styles.revealCard} reveal`}
        style={{ transitionDelay: '0.18s' }}
      >
        <div className={`${styles.galleryIntro} reveal`} style={{ transitionDelay: '0.24s' }}>
          <p className={styles.sectionLabel}>Current collection</p>
          <p className={styles.sectionCopy}>
            This set focuses on Movie Night: images that are meant to spark reflection, discussion, and insight — the kind of frames that you might draw on a napkin to explain something important to a friend.
          </p>
          </div>

        <ThoughtGalleryLightbox 
          images={movieNightImages} 
          title="Movie Night"
        />
        </section>
    </main>
  )
}
