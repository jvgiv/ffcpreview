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
            <br />First Financial Advisory 
            <br />- Est. 1974 -{" "}
          </p>
          <div className="hero-logo-ring">
            <Image
              className="hero-logo-image"
              src="/FFLogo.png"
              alt="FFC Logo"
              width={250}
              height={280}
            />
          </div>
          {/* <h1 className="hero-title">
            <em>practical financial</em>
            <span className="hero-title-main">ORIENTATION</span>
          </h1> */}
          <p className="hero-sub-changes">
            {/* Financial stress isn&apos;t mostly a money problem. It&apos;s mostly a fog problem. Far Flung Change clears the fog.  - {" "}
            <strong style={{ color: "var(--white)" }}>Before you reach the Clubhouse.</strong> */}
            Finance doesn&apos;t have to feel like a{" "}
            <span style={{ color: "var(--red)" }}>
              <span style={{ fontWeight: "bold" }}>foreign</span>
            </span>{" "}
            <span style={{ fontStyle: "italic" }}>language</span>
            {/* <br />
            You don&apos;t have to be an expert to{" "}
            <span style={{ color: "var(--red)", fontStyle: "italic" }}>
              make <span style={{ fontWeight: "bold" }}>sense</span>
            </span>{" "}
            of money matters! */}
          </p>
          <ul style={{ listStyleType: "none" }} className="hero-sub-list">
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <div className="bullet-dot"></div>
              </div>
              See where you are on your financial map
              <span style={{ fontStyle: "italic", color: "var(--gray)" }}>
                today
              </span>
            </li>
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <div className="bullet-dot"></div>
              </div>
              <div className="hero-sub-item-text">
              Clarify what matters most to you{" "}
              <span style={{ fontStyle: "italic", color: "var(--gray)" }}>
                right now
              </span></div>
            </li>
            <li className="hero-sub-item">
              <div className="bullet-icon">
                <div className="bullet-dot"></div>
              </div>
              Identify your next step
              <span style={{ fontStyle: "italic", color: "var(--gray)" }}>
                with confidence
              </span>
            </li>
          </ul>
          <p className="hero-sub-changes">
            <span style={{ color: "var(--red)" }}>
              Welcome to Far Flung Change
            </span>
            <br /> practical financial orientation
            <br />
            for people who want clarity, not complexity.
          </p>
          {/* <p className="hero-sub">Welcome to FinancialOrientation</p> */}
          <div className="hero-actions">
            <Link href="#pricing" className="btn-primary">
              BE ORIENTED &gt;
            </Link>
            <Link href="/logged-in" className="btn-ghost">
              FREE Caddy Book of Orientation + Scorecard
            </Link>
          </div>
          <div className="brand-signature">
            <span className="sig-for">for</span>
            <span className="sig-main">
              <span className="red-word">growin'up's</span>{" "}
              <span className="white-word">sake</span>
            </span>
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
      <Pricing />
      <HomePageDefs />
      <NewScorecard />
      <Quote />
      <PunchTheClock />
    </main>
  );
}
