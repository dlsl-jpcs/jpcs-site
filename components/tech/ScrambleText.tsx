"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "01<>/{}[]#$%&*_=+";

/**
 * Text that "decodes" into place the first time it scrolls into view: unresolved characters cycle
 * through code glyphs and settle left to right. Writes textContent directly, so it never re-renders;
 * an invisible copy keeps the final width so the surrounding pill doesn't jitter.
 */
export default function ScrambleText({ text, duration = 750, className = "" }: { text: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = out.current;
    if (!inView || reduce || !el) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(p * text.length);
      el.textContent = [...text]
        .map((c, i) => (c === " " || i < revealed ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join("");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [inView, reduce, text, duration]);

  return (
    <span ref={ref} className={`inline-grid ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span ref={out} aria-hidden="true" className="col-start-1 row-start-1 whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}
