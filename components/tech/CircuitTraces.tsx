"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

// Kept near the edges so the traces frame content instead of running under it.
const TRACES: { d: string; end: [number, number] }[] = [
  { d: "M0 120 H260 L320 180 H520", end: [520, 180] },
  { d: "M1200 90 H980 L920 150 V300", end: [920, 300] },
  { d: "M0 640 H180 L240 580 H420 L470 530", end: [470, 530] },
  { d: "M1200 700 H1010 L950 640 H820", end: [820, 640] },
  { d: "M640 800 V740 L700 680 H860", end: [860, 680] },
];

const TONES = {
  dark: { base: "rgba(255,255,255,0.07)", pulse: "#c4ff47", node: "rgba(196,255,71,0.5)" },
  light: { base: "rgba(11,19,43,0.08)", pulse: "rgba(0,90,38,0.55)", node: "rgba(11,19,43,0.2)" },
};

/** Faint circuit traces with light pulses running along them. Paused while offscreen. */
export default function CircuitTraces({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  const c = TONES[tone];

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      data-paused={!inView}
      className={`circuit pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {TRACES.map((t, i) => (
        <g key={t.d}>
          <path d={t.d} stroke={c.base} strokeWidth="1.5" />
          <path
            d={t.d}
            pathLength={100}
            stroke={c.pulse}
            strokeWidth="2"
            strokeLinecap="round"
            className="trace-pulse"
            style={{ animationDelay: `${i * -1.6}s` }}
          />
          <circle cx={t.end[0]} cy={t.end[1]} r="4" fill="none" stroke={c.node} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
