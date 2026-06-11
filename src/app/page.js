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

          {/* <h1 className="hero-title">
            <em>practical financial</em>
            <span className="hero-title-main">ORIENTATION</span>
          </h1> */}
          <div className="hero-sub-changes-top">
            {/* Financial stress isn&apos;t mostly a money problem. It&apos;s mostly a fog problem. Far Flung Change clears the fog.  - {" "}
            <strong style={{ color: "var(--white)" }}>Before you reach the Clubhouse.</strong> */}
            Facing your finances <br /> doesn&apos;t have to feel <br /> like
            roaming a{" "}
            <span style={{ color: "var(--red)" }}>
              <span style={{ fontWeight: "bold" }}>foreign</span>
            </span>{" "}
            {/* <span style={{ fontStyle: "italic" }}> */}
            land
            {/* </span> */}
            {/* <br />
            You don&apos;t have to be an expert to{" "}
            <span style={{ color: "var(--red)", fontStyle: "italic" }}>
              make <span style={{ fontWeight: "bold" }}>sense</span>
            </span>{" "}
            of money matters! */}
          </div>
          <p className="hero-sub-title-text">
            Financial orientation is simply knowing where you stand...and what's
            around. 
            <br />
            So you&apos;re confident the next move you make is the clear
            choice.
          </p>
          <ul style={{ listStyleType: "none" }} className="hero-sub-list">
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <span style={{ color: "var(--white)" }}>POSITION</span>
                {/* <div className="bullet-dot"></div> */}
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
              {/* </span> */}
            </li>
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <span style={{ color: "var(--white)" }}>QUESTIONS</span>
                {/* <div className="bullet-dot"></div> */}
              </div>
              <div className="hero-sub-item-text">
                <span style={{ color: "var(--gray)" }}>
                  Clarify what matters most to you{" "}
                  {/* <span style={{ fontStyle: "italic", color: "var(--gray)" }}> */}
                  right now
                </span>
                {/* </span> */}
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
                {/* <div className="bullet-dot"></div> */}
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
          </ul>
          <div className="hero-sub-changes">
            {/* <span style={{ color: "var(--red)" }}>
              Welcome to Far Flung Change
            </span> */}
            {/* <p>practical financial orientation</p> */}
            <p
              style={{
                color: "var(--homepage-gray)",
                fontSize: "clamp(1.8rem, 2vw, 1.2rem)",
                lineHeight: "1.3",
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontWeight: "bold",
                paddingBottom: "1rem",
              }}
            >
              For people who want clarity. Not complexity.
            </p>

            <Image
              src="/pfo.png"
              alt="practical financial orientation"
              width={599}
              height={104}
              style={{ width: "100%", height: "auto", maxWidth: "599px" }}
            />
            <div className="hero-logo-ring">
              <Image
                className="hero-logo-image"
                src="/FFLogo.png"
                alt="FFC Logo"
                width={500}
                height={560}
              />
            </div>
          </div>
          {/* <p className="hero-sub">Welcome to FinancialOrientation</p> */}
          <div className="brand-signature">
            <Image
              src="/ffcfgus.png"
              alt="for Growin'up's sake"
              width={358}
              height={100}
            />
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
              REVIEW THE OFFER &gt;
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
