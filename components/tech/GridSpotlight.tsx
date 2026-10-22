"use client";

import { useRef } from "react";
import { useFinePointer, usePointerVars } from "./hooks";

const NEON_LINE = "rgba(196,255,71,0.16)";

/**
 * A brighter neon grid with node dots, revealed only in a circle around the cursor. Place it as
 * the first child of a `relative overflow-hidden` section; its 4rem tiles line up with the
 * sections' existing faint grids. Not mounted on touch devices.
 */
export default function GridSpotlight({ radius = 260 }: { radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  usePointerVars(ref, fine);
  if (!fine) return null;

  const mask = `radial-gradient(circle ${radius}px at var(--mx, -999px) var(--my, -999px), #000 0%, transparent 100%)`;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
      style={{
        opacity: "var(--spot, 0)",
        maskImage: mask,
        WebkitMaskImage: mask,
        backgroundImage: `linear-gradient(to right, ${NEON_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${NEON_LINE} 1px, transparent 1px), radial-gradient(circle, rgba(196,255,71,0.6) 1.5px, transparent 2.5px)`,
        backgroundSize: "4rem 4rem",
        // Shift the dot layer half a tile so dots sit on line intersections.
        backgroundPosition: "0 0, 0 0, -2rem -2rem",
      }}
    />
  );
}
