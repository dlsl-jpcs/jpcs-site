"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface TypewriterProps {
  text: string;
  className?: string;
  /** ms to wait after coming into view before typing starts. */
  delay?: number;
  /** ms per character. */
  speed?: number;
  caret?: boolean;
  /** Skip the screen-reader copy when the parent is already aria-hidden. */
  decorative?: boolean;
}

/**
 * Types `text` out once it scrolls into view, terminal style. An invisible copy of the full text
 * reserves the final size, so the line never reflows while typing.
 */
export default function Typewriter({ text, className = "", delay = 0, speed = 35, caret = true, decorative = false }: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  // Full text on the server and for reduced motion; emptied on mount so it can type in.
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (!reduce) setCount(0);
  }, [reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c + 1 >= text.length) window.clearInterval(interval);
          return Math.min(c + 1, text.length);
        });
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [inView, reduce, text, speed, delay]);

  const caretEl = caret && (
    <span className="ml-[0.15em] inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-current animate-caret" />
  );

  return (
    <span ref={ref} className={`inline-grid ${className}`}>
      {!decorative && <span className="sr-only">{text}</span>}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
        {caretEl}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {text.slice(0, count)}
        {caretEl}
      </span>
    </span>
  );
}
