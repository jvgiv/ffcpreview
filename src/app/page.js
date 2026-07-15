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
            Facing your finances <br /> doesn&apos;t{" "}
            <span style={{ fontStyle: "italic", color: "#888" }}>have to</span>
            &nbsp;&nbsp;feel <br /> like roaming a{" "}
            <span style={{ color: "var(--red)" }}>
              <span style={{ fontWeight: "bold" }}>foreign</span>
            </span>{" "}
            land
          </div>
          <p className="hero-sub-title-text reveal">
            Find your bearings with Financial Orientation,
            <br /> so your next step is on{" "}
            <span style={{ fontWeight: "bold" }}>purpose</span>
          </p>
          <Link
              href="/orientation"
              className="btn-primary reveal"
              style={{ fontSize: "1.3em" }}
            >
              LEARN HOW NOW
            </Link>
          {/* <ul style={{ listStyleType: "none" }} className="hero-sub-list">
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <span style={{ color: "var(--white)" }}>POSITION</span>
              </div>
              <div className="hero-sub-item-text">
                <span style={{ color: "var(--gray)" }}>
                  See where you are on your financial map today
                </span>
              </div>
              <div className="hero-sub-icon">
                <Image
                  src="/svg/eye.svg"
                  alt="eyeball"
                  width={40}
                  height={40}
                  style={{ marginLeft: "0.5rem" }}
                />
              </div>
            </li>
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <span style={{ color: "var(--white)" }}>QUESTIONS</span>
              </div>
              <div className="hero-sub-item-text">
                <span style={{ color: "var(--gray)" }}>
                  Clarify what matters most to you{" "}
                  right now
                </span>
              </div>
              <div className="hero-sub-icon">
                <Image
                  src="/svg/mag.svg"
                  alt="magnifying glass"
                  width={40}
                  height={40}
                  style={{ marginLeft: "0.5rem" }}
                />
              </div>
            </li>
            <li className="hero-sub-item">
              <div className="bullet-icon">
                READINESS
              </div>
              <div className="hero-sub-item-text">
                <span style={{ color: "var(--white)" }}>
                  Identify your next step with confidence
                </span>
              </div>
              <div className="hero-sub-icon">
                <Image
                  src="/svg/chair.svg"
                  alt="crosshair"
                  width={40}
                  height={40}
                  style={{ marginLeft: "0.5rem" }}
                />
              </div>
            </li>
          </ul> */}
          <div className="hero-sub-changes">
            {/* <span style={{ color: "var(--red)" }}>
              Welcome to Far Flung Change
            </span> */}
            {/* <p>practical financial orientation</p> */}
            {/* <p
              style={{
                color: "var(--homepage-gray)",
                fontSize: "clamp(1.8rem, 2vw, 1.2rem)",
                lineHeight: "1.3",
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: "bold",
                paddingBottom: "1rem",
                marginBottom: "5rem",
              }}
            >
              For people who want clarity. Not complexity.
            </p> */}

            {/* <Image
              src="/pfo.png"
              alt="practical financial orientation"
              width={599}
              height={104}
              style={{ width: "100%", height: "auto", maxWidth: "599px" }}
            /> */}
            {/* <div className="hero-logo-ring"> */}
            {/* <div className="hero-image-block hero-logo-block"> */}
              <Image
                className="hero-graphic-image"
                src="/svg/lgs.png"
                alt="FFC Logo"
                width={412}
                height={394}
              />
            {/* </div> */}
            {/* </div> */}

            <div className="hero-image-block hero-final-block">
              <Image
                className="hero-final-image"
                src="/home/final.png"
                width={750}
                height={766}
                sizes="(max-width: 768px) 70vw, 700px"
                alt="Flight Path"
              />
            </div>
            {/* <div className="mobile-hidden" style={{  }}>
              <Image
                src="/home/homebox.png"
                width={870}
                height={830}
                alt="flight path"
              />
            </div> */}
          </div>
          {/* <p className="hero-sub">Welcome to FinancialOrientation</p> */}
          <div className="brand-signature">
            {/* <Image
              src="/ffcfgus.png"
              alt="for Growin'up's sake"
              width={358}
              height={100}
            /> */}
            {/* <span className="sig-for">for</span>
            <span className="sig-main">
              <span className="red-word">growin'up's</span>{" "}
              <span className="white-word">sake</span>
            </span> */}
          </div>
          <div className="hero-actions">
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
          </div>

          <div className="scroll-hint">
            <span>scroll</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </section>
      <Problem />
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
