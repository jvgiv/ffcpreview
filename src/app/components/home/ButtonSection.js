import React from "react";
import Image from "next/image";

export default function ButtonSection() {
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
        <div className="button-section-actions">
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
        </div>
        <div className="button-section-actions">
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
        </div>
        <div className="button-section-footer">
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />

          <p>MOMENTUM BEGINS HERE</p>
        </div>
      </div>

      <div className="button-section-panel">
        <h3 className="button-section-eyebrow">
          <span style={{ color: "var(--red)" }}>ENROLL</span> +{" "}
          <span style={{ color: "var(--red)" }}>ACCESS</span>
        </h3>
        <h2 className="button-section-title">
          GUIDED <span style={{ color: "var(--red)" }}>ORIENTATION</span>
        </h2>
        <div className="button-section-actions">
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
        </div>
        <div className="button-section-actions">
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
        </div>
        <div className="button-section-footer">
          <Image
            src="/buttons/seehow.png"
            alt="See How"
            width={175}
            height={142}
          />
          <p>MOMENTUM BEGINS HERE</p>
        </div>
      </div>
    </section>
  );
}
