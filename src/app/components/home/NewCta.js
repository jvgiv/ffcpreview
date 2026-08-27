import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewCta() {
  return (
    <section className="new-cta" aria-label="Begin registration">
      <Link className="new-cta-link" href="/register">
        <Image
          className="new-cta-image"
          src="/newcta/lpmub.png"
          alt="Are you ready to stop guessing? Begin now."
          width={4500}
          height={4875}
          sizes="(max-width: 768px) 92vw, 760px"
        />
      </Link>
    </section>
  );
}
