"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = ".reveal";

export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.querySelector("nav");
    const observed = new Set();
    let observer;
    let mutationObserver;
    let scanFrame = 0;
    const scanTimeouts = [];

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElement = (el) => {
      el.classList.add("visible");

      if (observer) {
        observer.unobserve(el);
      }

      observed.delete(el);
    };

    const isInRevealRange = (el) => {
      const rect = el.getBoundingClientRect();

      return rect.top <= window.innerHeight * 0.88 && rect.bottom >= 0;
    };

    const observeReveal = (el) => {
      if (!(el instanceof Element) || !el.matches(REVEAL_SELECTOR)) return;
      if (el.classList.contains("visible")) return;

      if (prefersReducedMotion || isInRevealRange(el)) {
        revealElement(el);
        return;
      }

      if (!observed.has(el)) {
        observed.add(el);
        observer.observe(el);
      }
    };

    const scanForReveals = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(observeReveal);
    };

    const requestRevealScan = () => {
      if (scanFrame) return;

      scanFrame = window.requestAnimationFrame(() => {
        scanFrame = 0;
        scanForReveals();
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          observeReveal(node);
          node.querySelectorAll(REVEAL_SELECTOR).forEach(observeReveal);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    requestRevealScan();
    [80, 250, 700].forEach((delay) => {
      const timeoutId = window.setTimeout(requestRevealScan, delay);
      scanTimeouts.push(timeoutId);
    });

    const handleScroll = () => {
      if (nav) {
        if (window.scrollY > 60) {
          nav.classList.add("nav-scrolled");
        } else {
          nav.classList.remove("nav-scrolled");
        }
      }

      requestRevealScan();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", requestRevealScan);
    window.addEventListener("load", requestRevealScan);
    handleScroll();

    return () => {
      if (scanFrame) {
        window.cancelAnimationFrame(scanFrame);
      }

      scanTimeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });

      if (observer) {
        observer.disconnect();
      }

      if (mutationObserver) {
        mutationObserver.disconnect();
      }

      observed.clear();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", requestRevealScan);
      window.removeEventListener("load", requestRevealScan);
    };
  }, [pathname]);

  return null;
}
