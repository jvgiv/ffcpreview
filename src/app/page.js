import Problem from "./(content)/problem/page";
import Plan from "./(content)/plan/page";
import Pricing from "./(content)/pricing/page";
import Guide from "./(content)/guide/page";
import NewScorecard from "./(content)/newScorecard/page";
import "./homepage.css";
import Quote from "./(content)/quote/page";
import PunchTheClock from "./(content)/punchTheClock/page";
import Image from "next/image";
import Link from "next/link";
import HomePageDefs from "./components/homepagedefs/HomePageDefs";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-inner container">
          <p className="hero-eyebrow-top">First Financial Advisory - Est. 1974</p>
          <div className="hero-logo-ring">
            <Image
              src='/ffc-dark.svg'
              alt="FFC Logo"
              width={110}
              height={110}
            />
          </div>
          <h1 className="hero-title">
            <em>practical financial</em>
            <span className="hero-title-main">ORIENTATION</span>
          </h1>
          <p className="hero-sub">
            Most adults never get a clear introduction to managing their own money.
            Far Flung Change fills that gap -{" "}
            <strong style={{ color: "var(--white)" }}>before it costs you.</strong>
          </p>
          <div className="hero-actions">
            <Link href="#pricing" className="btn-primary">Get Oriented -&gt;</Link>
            <Link href="/login" className="btn-ghost">Unlock Free Caddy Book</Link>
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
