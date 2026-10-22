"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${scrolled / 100})`;
        }
        // Mono readout riding the bar's leading edge (desktop only), e.g. "042%".
        const readout = readoutRef.current;
        if (readout) {
          readout.textContent = `${String(Math.round(scrolled)).padStart(3, "0")}%`;
          readout.style.transform = `translateX(calc(${scrolled}vw - ${scrolled}%))`;
          readout.style.opacity = scrollTop > 40 ? "1" : "0";
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="fixed top-0 left-0 h-1 w-full origin-left bg-light-green z-50"
        style={{ transform: "scaleX(0)" }}
      />
      <span
        ref={readoutRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-1.5 left-0 z-50 hidden lg:block rounded-sm bg-navy/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-neon opacity-0 transition-opacity duration-300 backdrop-blur-sm"
      />
    </>
  );
}
