"use client";
import React from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import "../homepage.css";

export default function ScoreCardLightbox({ images }) {
  const [index, setIndex] = useState(-1);

  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
  }));

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {images.map((img, key) => {
          return (
            <div
              key={key}
              onClick={function () {
                setIndex(key);
              }}
              style={{ cursor: "pointer", width: "48%" }}
               className="scorecard-image-wrapper"
            >
              <Image
                
                src={img.src}
                alt={img.alt}
                width={400}
                height={500}
                sizes="(max-width: 768px) 50vw, 200px"
              />
            </div>
          );
        })}
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
  );
}
