import Problem from "./components/home/Problem";
import Plan from "./components/home/Plan";
import Pricing from "./components/home/Pricing";
import Guide from "./components/home/Guide";
import NewScorecard from "./components/home/NewScorecard";
import "./homepage.css";
import Quote from "./components/home/Quote";
import PunchTheClock from "./components/home/PunchTheClock";
import Image from "next/image";
import Link from "next/link";
import HomePageDefs from "./components/home/HomePageDefs";
import BelowLogo from "./components/home/BelowLogo";
import { Button } from "@mui/material";
import ButtonSection from "./components/home/ButtonSection";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-inner container">
          <p className="hero-eyebrow-top">
            A division of
            <br />
            First Financial Advisory
            <br />- Est. 1974 -{" "}
          </p>
          <div className="hero-sub-changes-top">
            {/* Financial stress isn&apos;t mostly a money problem. It&apos;s mostly a fog problem. Far Flung Change clears the fog.  - {" "}
            <strong style={{ color: "var(--white)" }}>Before you reach the Clubhouse.</strong> */}
            STOP{" "}
            <span style={{ color: "var(--red)" }}>
              <span style={{ fontWeight: "bold" }}>GUESSING</span> <br />
            </span>{" "}
            ABOUT MONEY MATTERS
          </div>
          <p className="hero-sub-title-text reveal">
            Financial Orientation helps
            <br /> you find your bearings,
            <br /> so your next money move
            <br /> is{" "}
            <span style={{ fontWeight: "bold", color: "white" }}>
              on purpose
            </span>
          </p>
          <Link
            href="/orientation"
            className="btn-primary reveal"
            style={{ fontSize: "1.3em" }}
          >
            SEE HOW IT WORKS
          </Link>
          <div className="friction-stat reveal">
            <div className="stat-item">
              <div className="stat-block stat-block-top">
                <h2 className="stat-title-home">
                  WHAT THE <span style={{ color: "var(--red)" }}>NUMBERS</span>{" "}
                  SAY
                </h2>
                <p className="stat-num">
                  98:2 <span>ODDS</span>
                </p>
                <p className="stat-label">
                  the chance you&apos;re navigating money matters and making
                  choices without confidence
                </p>
              </div>
              <div className="stat-block stat-block-middle">
                <p className="stat-num">
                  X² <span>YEARS</span>
                </p>
                <p className="stat-label">
                  there&apos;s no telling how many years confusion will cost you
                  since it compounds indefinitely
                </p>
                {/* <div className="stat-divider" /> */}
              </div>
              <div className="stat-block stat-block-bottom">
                <p className="stat-num">
                  100% <span>CERTAINTY</span>
                </p>
                <p className="stat-label">
                  that you&apos;ve never been offered a simple way to gain basic
                  fluency in money matters
                  <br />
                  until now
                </p>
              </div>
            </div>
          </div>

          <div className="hero-sub-changes">
            <Image
              className="hero-graphic-image"
              src="/svg/lgs.png"
              alt="FFC Logo"
              width={412}
              height={394}
            />

            {/* <div className="hero-image-block hero-final-block">
              <Image
                className="hero-final-image"
                src="/home/final.png"
                width={750}
                height={766}
                sizes="(max-width: 768px) 70vw, 700px"
                alt="Flight Path"
              />
            </div> */}
          </div>

          <ButtonSection />

          <BelowLogo />
          <div className="brand-signature"></div>
          {/* <div className="hero-actions">
            <Link
              href="#pricing-card"
              className="btn-primary"
              style={{ fontSize: "1.3em" }}
            >
              REVIEW THE OFFER
            </Link>
            <Link
              href="/logged-in/#member-access"
              className="btn-ghost"
              style={{ fontSize: "1.3em" }}
            >
              FREE Caddy Book + Scorecard
            </Link>
          </div> */}

          <div className="scroll-hint">
            {/* <span>scroll</span> */}
            <div className="scroll-line"></div>
          </div>
        </div>
      </section>
      {/* <Problem /> */}
      <Guide />
      <Plan />
      <HomePageDefs />
      <NewScorecard />
      <Pricing />
      <Quote />
      <PunchTheClock />
    </main>
  );
}
