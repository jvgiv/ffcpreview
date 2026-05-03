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
          <p className="hero-eyebrow-top">A Special Program from First Financial Advisory - Est. 1974</p>
          <div className="hero-logo-ring">
            <Image
              className="hero-logo-image"
              src='/fflogo.png'
              alt="FFC Logo"
              width={140}
              height={155}
            />
          </div>
          <h1 className="hero-title">
            <em>practical financial</em>
            <span className="hero-title-main">ORIENTATION</span>
          </h1>
          <p className="hero-sub">
            Financial stress isn&apos;t mostly a money problem. It&apos;s mostly a fog problem. Far Flung Change clears the fog.  - {" "}
            <strong style={{ color: "var(--white)" }}>Before you reach the clubhouse.</strong>
          </p>
          <p className="hero-sub">Welcome to <span style={{color: "var(--red)"}}>Financial</span> Orientation</p>
          <div className="hero-actions">
            <Link href="#pricing" className="btn-primary">Get Oriented -&gt;</Link>
            <Link href="/logged-in" className="btn-ghost">Unlock FREE Caddy Book of Orientation + Scorecard</Link>
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
