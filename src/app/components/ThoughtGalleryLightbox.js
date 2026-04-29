'use client'
import React from 'react'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Image from 'next/image'
import styles from './GameTheory.module.css'

export default function ThoughtGalleryLightbox({ images, title }) {
  const [index, setIndex] = useState(-1);
  
      const slides = images.map((img) => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
      }));


  return (
      <div className={styles.gallery}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.meta}>{images.length} frames in view</p>
      </div>
      <div className={styles.grid}>
        {images.map(function (img, idx) {
            return (
                <div
                    key={idx}
                    className={styles.tile}
                    onClick={function () {
                        setIndex(idx);
                    }}
                >
                    <Image
                        src={img.src}
                        alt={img.alt}
                        width={400} // thumbnail size
                        height={300}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        className={styles.image}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgH3Xv0Z3QAAAABJRU5ErkJggg=="
                    />
                </div>
                )})}
            
      </div>
    
      
    <Lightbox
        open={index >= 0}
        close={function () {
          setIndex(-1);
        }}
        slides={slides}
        index={index}
    />
    </div>
  )
}
