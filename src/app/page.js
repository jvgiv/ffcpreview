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

          <div>
            <h2>WHAT DO YOU GET WITH</h2>
            <h1>GUIDED ORIENTATION?</h1>
            <h3 style={{color: "var(--gray)"}}>EVERYTHING YOU NEED
              <br />
              TO FORGE FOG INTO <span style={{color: "var(--white"}}>FOCUS</span> 
              <br /> and nothing you don&apos;t
            </h3>
            <div>
              <h1><span style={{ color: "var(--red)", fontSize: "1rem" }}>01</span> YOUR <span style={{color: "var(--red)"}}>TREASURE</span> MAP</h1>
              <p>Your facts and your perspective, brought together in a clear, personal polaroid showing where you stand</p>
            </div>
            <div>
              <h1><span style={{ color: "var(--red)", fontSize: "1rem" }}>02</span> YOUR <span style={{color: "var(--red)"}}>FIELD</span> GUIDE</h1>
              <p>650+ terms described plainly with practical field notes.  No jargon and no guessing what things mean.</p>
            </div>
            <div>
              <h1><span style={{ color: "var(--red)", fontSize: "1rem" }}>03</span> YOUR <span style={{color: "var(--red)"}}>DIRECT</span> LINE</h1>
              <p>Unlimited fiduciary-level answers as real questions arise, for one full year.  And with no sales agenda attached.</p>
            </div>
          </div>

          <div>
            <h2 className="stat-title-home" style={{ color: "var(--red)" }}>
              THE <span style={{ color: "var(--white)" }}>[</span>SIMPLE
              <span style={{ color: "var(--white)" }}>]</span> PROCESS
            </h2>
            <h1>HOW ORIENTATION WORKS</h1>
            <p className="how-p-text">Financial Orientation comes in two phases.</p>
            <p className="how-p-text">The first gets you moving.</p>
            <p className="how-p-text">The second keeps you going.</p>
            <div>
              <h1>
                <span style={{ color: "var(--red)", fontSize: "1rem" }}>
                  01
                </span>{" "}
                GETTING STARTED
              </h1>
              <div>
                <h2>
                  <span style={{ color: "var(--red)" }}>S</span>URVEY YOUR
                  TERRAIN
                </h2>
                <p className="how-p-text">
                  we gather facts together, so nothing about your finances
                  remains unknown
                </p>
              </div>
              <div>
                <h2>
                  <span style={{ color: "var(--red)" }}>I</span>DENTIFY YOUR
                  POSITION
                </h2>
                <p className="how-p-text">see where you stand with the Caddy Book of Orientation</p>
              </div>
              <div>
                <h2>
                  <span style={{ color: "var(--red)" }}>M</span>AP YOUR ASSETS
                </h2>
                <p className="how-p-text">
                  your figures and your perspective together on your own
                  treasure map
                </p>
              </div>
            </div>

            <div>
              <h1>
                <span style={{ color: "var(--red)", fontSize: "1rem" }}>
                  02
                </span>{" "}
                MOVING FORWARD
              </h1>
              <div>
                <h2>
                  <span style={{ color: "var(--red)" }}>P</span>ACE YOUR
                  PROGRESS
                </h2>
                <p className="how-p-text">
                  orientation unfolds over a year, not an afternoon, so nothing
                  is rushed
                </p>
              </div>
              <div>
                <h2>
                  <span style={{ color: "var(--red)" }}>L</span>EVERAGE YOUR
                  LEARNING
                </h2>
                <p className="how-p-text">
                  each question you ask and get answered sharpens your clarity
                  and judgment
                </p>
              </div>
              <div>
                <h2>
                  <span style={{ color: "var(--red)" }}>E</span>XPAND YOUR
                  POTENTIAL
                </h2>
                <p className="how-p-text">
                  see the clarity turn into confident, deliberate
                  decision-making
                </p>
              </div>
            </div>
          </div>
          <div className="brand-signature"></div>
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
