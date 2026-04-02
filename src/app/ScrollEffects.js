"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.querySelector("nav");
    let observer;
    let reveals = [];

    const bindRevealObserver = () => {
      reveals = Array.from(document.querySelectorAll(".reveal"));

      if (!reveals.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px",
        }
      );

      reveals.forEach((el) => observer.observe(el));
    };

    const rafId = window.requestAnimationFrame(bindRevealObserver);

    const handleScroll = () => {
      if (!nav) return;

      if (window.scrollY > 60) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.cancelAnimationFrame(rafId);

      if (observer) {
        reveals.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}
