"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const previewButtons = [
  {
    buttonSrc: "/buttons/caddybookbutton.png",
    buttonAlt: "CaddyBook",
    preview: {
      src: "/buttonpreviews/cb.png",
      alt: "CaddyBook Preview",
      width: 1500,
      height: 1500,
    },
  },
  {
    buttonSrc: "/buttons/scorecardbutton.png",
    buttonAlt: "Scorecard",
    preview: {
      src: "/buttonpreviews/sc.png",
      alt: "Scorecard Preview",
      width: 1500,
      height: 1500,
    },
  },
  {
    buttonSrc: "/buttons/tmapbutton.png",
    buttonAlt: "Treasure Map",
    preview: {
      src: "/buttonpreviews/map.png",
      alt: "Treasure Map Preview",
      width: 1500,
      height: 1500,
    },
  },
  {
    buttonSrc: "/buttons/dstardefsbutton.png",
    buttonAlt: "DogStar Definitions",
    preview: {
      src: '/buttonpreviews/dsd.png',
      alt: "DogStar Definitions Preview",
      width: 1500,
      height: 1500,
  }
  },
  {
    buttonSrc: "/buttons/IRLoopbutton.png",
    buttonAlt: "IR-Loop",
    preview: {
      src: '/buttonpreviews/irl.png',
      alt: "IR-Loop Preview",
      width: 1500,
      height: 1500,
  }
  },
  {
    buttonSrc: "/buttons/flightcrewbutton.png",
    buttonAlt: "Flight Crew",
    preview: {
      src: '/buttonpreviews/fc.png',
      alt: "Flight Crew Preview",
      width: 1500,
      height: 1500,
  }
  }
];


export default function ButtonSection() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const slides = previewButtons.map((button) => button.preview);

  return (
    <section className="button-section" aria-label="Orientation options">
      <div className="button-section-panel">
        <h3 className="button-section-eyebrow">
          <span style={{ color: "var(--red)" }}>REGISTER</span> +{" "}
          <span style={{ color: "var(--red)" }}>UNLOCK</span>
        </h3>
        <h2 className="button-section-title">
          FREE <span style={{ color: "var(--red)" }}>ORIENTATION</span> TOOLS
        </h2>
        <div className="button-section-actions-left">
          {previewButtons.slice(0, 2).map((button, index) => (
            <button
              key={button.buttonSrc}
              type="button"
              className="button-section-image-button"
              aria-label={`Open ${button.buttonAlt} preview`}
              onClick={() => {
                setLightboxIndex(index);
              }}
            >
              <Image
                src={button.buttonSrc}
                alt=""
                width={175}
                height={142}
              />
            </button>
          ))}
        </div>
        
        <div className="button-section-footer">
          <Image
            src="/buttons/register+momorrow.png"
            alt="See How"
            width={400}
            height={163}
          />
        </div>
      </div>

      <div className="button-section-panel">
        <h3 className="button-section-eyebrow">
          <span style={{ color: "var(--red)" }}>ENROLL</span> +{" "}
          <span style={{ color: "var(--red)" }}>ACCESS</span>
        </h3>
        <h2 className="button-section-title">
          GUIDED <span style={{ color: "var(--red)" }}><br />ORIENTATION</span>
        </h2>
        <div className="button-section-actions">
          <button
            type="button"
            className="button-section-image-button"
            aria-label={`Open ${previewButtons[2].buttonAlt} preview`}
            onClick={() => {
              setLightboxIndex(2);
            }}
          >
            <Image
              src={previewButtons[2].buttonSrc}
              alt=""
              width={175}
              height={142}
            />
          </button>
        </div>
        <div className="button-section-actions">
            {previewButtons.slice(3, 5).map((button, index) => (
            <button
              key={button.buttonSrc}
              type="button"
              className="button-section-image-button"
              aria-label={`Open ${button.buttonAlt} preview`}
              onClick={() => {
                setLightboxIndex(index + 3);
              }}
            >
              <Image
                src={button.buttonSrc}
                alt=""
                width={175}
                height={142}
              />
            </button>
          ))}
            
          <div className="button-section-actions">
          <button
            type="button"
            className="button-section-image-button"
            aria-label={`Open ${previewButtons[5].buttonAlt} preview`}
            onClick={() => {
              setLightboxIndex(5);
            }}
          >
            <Image
              src={previewButtons[5].buttonSrc}
              alt=""
              width={175}
              height={142}
            />
          </button>
        </div>
        </div>
        <div className="button-section-footer">
          <Image
            src="/buttons/enroll+momorrow.png"
            alt="See How"
            width={175}
            height={142}
          />
        </div>
        
      </div>
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => {
          setLightboxIndex(-1);
        }}
        slides={slides}
        index={lightboxIndex}
      />
    </section>
  );
}
