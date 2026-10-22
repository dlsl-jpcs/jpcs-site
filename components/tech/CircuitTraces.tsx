"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Pt = [number, number];
export type Corner = "tl" | "tr" | "bl" | "br";

const DURATION = 7000;
const TRAVEL = 0.6; // share of each cycle the pulse spends moving; the rest is a pause
const EASE = "cubic-bezier(0.45, 0, 0.25, 1)";

// One "data bus" motif, in px relative to a top-left corner: three parallel traces entering from
// the screen edge with sharp 45° steps, each ending in a node. It stays 56–144px from the
// horizontal edge, clear of the 40px that neighbouring sections overlap with their rounded tops,
// and is mirrored for the other corners.
const MOTIF: Pt[][] = [
  [[0, 144], [150, 144], [190, 104], [240, 104]],
  [[0, 120], [110, 120], [150, 80], [300, 80]],
  [[0, 96], [70, 96], [110, 56], [200, 56]],
];

// The pulse is a stretch of the trace itself lighting up: a bright head plus two fainter, longer
// dashes behind it that read as a tail. Lengths are in pathLength units (the whole trace = 100).
const LAYERS = [
  { len: 16, width: 4, opacity: 0.12 },
  { len: 9, width: 2, opacity: 0.4 },
  { len: 3, width: 2, opacity: 1 },
];
const RUN = 100 + LAYERS[0].len; // head travels until the longest tail has left the trace

const TONES = {
  dark: { base: "rgba(255,255,255,0.1)", pulse: "#c4ff47", node: "rgba(196,255,71,0.5)" },
  light: { base: "rgba(11,19,43,0.1)", pulse: "rgba(0,110,40,0.75)", node: "rgba(11,19,43,0.22)" },
};

function buildTraces(corners: Corner[], w: number, h: number) {
  // Narrow screens get a horizontally compressed motif; vertical offsets stay fixed so the
  // traces keep clear of overlapped edges.
  const k = Math.min(1, Math.max(0.55, w / 1100));
  return corners.flatMap((corner) =>
    MOTIF.map((pts) => {
      const mapped = pts.map(([x, y]): Pt => [
        corner.endsWith("r") ? w - x * k : x * k,
        corner.startsWith("b") ? h - y : y,
      ]);
      return {
        d: mapped.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" "),
        end: mapped[mapped.length - 1],
      };
    }),
  );
}

/**
 * Faint circuit traces in chosen corners of a section, with light pulses running from the screen
 * edge to each end node. Drawn at the section's real pixel size so line weight never scales.
 * Pulses are dash offsets animated with the Web Animations API, eased in and out, paused while
 * offscreen and absent for reduced motion. Pick corners that are empty in the section's layout.
 */
export default function CircuitTraces({
  tone = "light",
  corners,
  className = "",
}: {
  tone?: "light" | "dark";
  corners: Corner[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animations = useRef<Animation[]>([]);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const c = TONES[tone];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const traces = size ? buildTraces(corners, size.w, size.h) : [];
  const key = traces.map((t) => t.d).join("|");

  useEffect(() => {
    const svg = svgRef.current;
    if (reduce || !svg || !svg.animate || !key) return;
    const made: Animation[] = [];
    svg.querySelectorAll<SVGGElement>("g[data-trace]").forEach((g, i) => {
      const timing = { duration: DURATION, iterations: Infinity, delay: -i * 1100 };
      // A dash of length L at offset o covers [-o, L - o]; animating o from L to L - RUN sweeps
      // the head from the trace's start to past its end.
      g.querySelectorAll<SVGPathElement>("path[data-len]").forEach((path) => {
        const len = Number(path.dataset.len);
        made.push(
          path.animate(
            [
              { strokeDashoffset: len, offset: 0, easing: EASE },
              { strokeDashoffset: len - RUN, offset: TRAVEL },
              { strokeDashoffset: len - RUN, offset: 1 },
            ],
            timing,
          ),
        );
      });
      // The end node flashes as the head arrives.
      const node = g.querySelector<SVGCircleElement>("circle[data-flash]");
      if (node) {
        made.push(
          node.animate(
            [
              { opacity: 0, offset: 0 },
              { opacity: 0, offset: TRAVEL * 0.8 },
              { opacity: 1, offset: TRAVEL * 0.86 },
              { opacity: 0, offset: TRAVEL + 0.12 },
              { opacity: 0, offset: 1 },
            ],
            timing,
          ),
        );
      }
    });
    animations.current = made;
    return () => {
      made.forEach((a) => a.cancel());
      animations.current = [];
    };
  }, [reduce, key]);

  useEffect(() => {
    animations.current.forEach((a) => (inView ? a.play() : a.pause()));
  }, [inView, reduce, key]);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {size && (
        <svg ref={svgRef} width={size.w} height={size.h} fill="none" className="absolute inset-0">
          {traces.map((t) => (
            <g key={t.d} data-trace="">
              <path d={t.d} stroke={c.base} strokeWidth="1.5" />
              {!reduce &&
                LAYERS.map((l) => (
                  <path
                    key={l.len}
                    data-len={l.len}
                    d={t.d}
                    pathLength={100}
                    stroke={c.pulse}
                    strokeOpacity={l.opacity}
                    strokeWidth={l.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={`${l.len} ${100 + RUN}`}
                    // Parked before the start of the trace until the animation takes over.
                    strokeDashoffset={l.len}
                  />
                ))}
              <circle cx={t.end[0]} cy={t.end[1]} r="3.5" stroke={c.node} strokeWidth="1.5" />
              {!reduce && <circle data-flash="" cx={t.end[0]} cy={t.end[1]} r="3.5" fill={c.pulse} opacity={0} />}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
