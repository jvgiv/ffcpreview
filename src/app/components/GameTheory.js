'use client'
import React from 'react'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Image from 'next/image'
import styles from './GameTheory.module.css'

let images = [
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

export default function GameTheory() {
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
        <h2 className={styles.title}>Game Theory</h2>
        <p className={styles.meta}>9 frames in view</p>
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
            {/* // (image, key) => (
            // <Pic 
            // image={image.src}
            // key={key}
            // alt={image.alt}
            // />
            // ))} */}
      </div>
    
      
      {/* <h1 className='tg-title'>Director's Cut</h1> */}

    <Lightbox
        open={index >= 0}
        close={function () {
          setIndex(-1);
        }}
        slides={slides}
        index={index}
        // plugins={[Zoom]} // remove if you don't want zoom
        // carousel={{ finite: false }} // infinite scrolling (default is true)
      />
    </div>
  )
}
