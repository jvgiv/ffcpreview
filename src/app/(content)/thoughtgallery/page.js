'use client'
import React from 'react'
import ThoughtGalleryLightbox from '@/app/components/ThoughtGalleryLightbox'
import styles from './page.module.css'
import '../../homepage.css'
import { useState } from 'react'

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

const galleries = [
  {
    images: gameTheoryImages,
    title: "Game Theory",
    copy: "Before spreadsheets, there were games. Turns out, they taught you every skill you needed : deliBErate : rememBErable : difBErent"
  },
  {
    images: movieNightImages,
    title: "Movie Night",
    copy: "Beyond classrooms, there were movies. Turns out, they taught you every concept you needed : sBEadfast : a reBEl : oBiEnted"
  },
  {
    images: fogSeriesImages,
    title: "Fog Bank",
    copy: "Most financial stress isn't about money. It's about fog. These frames help clear it. : BE Oriented :"
  },
  {
    images: oriMattImages,
    title: "Come on Up to the House",
    copy: "You don't need more information. You need a place to stand. Come on Up + Mind Your Step"
  }
]


export default function ThoughtGallery() {
  const [gallery, setGallery] = useState(0);
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroCopy} ${styles.revealCard} reveal`}>
          <p className={styles.eyebrow}>Thought Gallery</p>
          <h1 className={styles.title}>
            Visual prompts for <span>deliberate thinking.</span>
          </h1>
          <p className={styles.lead}>
            Frames that change what you see when you linger and look.
          </p>
        </div>

        <aside
          className={`${styles.heroPanel} ${styles.revealCard} reveal`}
          style={{ transitionDelay: '0.12s' }}
        >
          <p className={styles.panelLabel}>HOW TO WALK IN</p>
          <p className={styles.panelBody}>
            Browse the boards. Open anything that stops you. This is a place to notice patterns, not collect answers.
          </p>
        </aside>
      </section>

      <nav className={styles.navBar}>
        {galleries.map((gal, index) => (
          <button
            key={index}
            className={`${styles.navButton} ${gallery === index ? styles.active : ''}`}
            onClick={() => setGallery(index)}
          >
            {gal.title}
          </button>
        ))}
      </nav>

      <section
        className={`${styles.gallerySection} ${styles.revealCard} reveal`}
        style={{ transitionDelay: '0.18s' }}
      >
         <div className={`${styles.galleryIntro} reveal`} style={{ transitionDelay: '0.24s' }}>
        <p className={styles.sectionLabel}>Chamber Contents</p>
         </div>
        <ThoughtGalleryLightbox 
          images={galleries[gallery].images} 
          title={galleries[gallery].title}
          copy={galleries[gallery].copy}
        />
      </section>


      
       
       
       
    </main>
  )
}
