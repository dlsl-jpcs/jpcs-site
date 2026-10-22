"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** True on mouse/trackpad devices. False during SSR and on touch, so cursor effects never mount there. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/**
 * Writes the pointer position (px, relative to `target`) into --mx/--my on `layer`, once per frame.
 * No React state, so moving the mouse never re-renders.
 */
export function usePointerVars(
  layer: RefObject<HTMLElement | null>,
  enabled: boolean,
  target: () => HTMLElement | null | undefined = () => layer.current?.parentElement,
) {
  useEffect(() => {
    const el = layer.current;
    const host = target();
    if (!enabled || !el || !host) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const flush = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    const onEnter = () => el.style.setProperty("--spot", "1");
    const onLeave = () => el.style.setProperty("--spot", "0");
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
    // target is a stable lookup; re-running on every render would re-bind listeners for nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer, enabled]);
}

/**
 * Sets --angle (deg, from the card centre to the pointer) on whichever `.border-beam` card inside
 * the returned ref is being hovered. One listener covers a whole grid of cards.
 */
export function useBorderBeam<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const fine = useFinePointer();
  useEffect(() => {
    const root = ref.current;
    if (!fine || !root) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      const el = (e.target as Element).closest<HTMLElement>(".border-beam");
      if (!el || !root.contains(el)) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const deg = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
        // conic-gradient's 0deg points up; atan2's points right. The bright arc starts 40deg in.
        el.style.setProperty("--angle", `${deg + 90 - 40}deg`);
      });
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
    };
  }, [fine]);
  return ref;
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Marquee offset in % (wrapping between -50 and 0) that drifts at `baseSpeed` %/s and speeds up
 * with scroll velocity. Also returns a small skew that leans with the scroll direction.
 * Holds still for reduced motion or while `active` is false (offscreen).
 */
export function useVelocityMarquee(
  baseSpeed: number,
  active: boolean,
): { x: MotionValue<string>; skew: MotionValue<number> } {
  const reduce = useReducedMotion();
  const offset = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-3000, 0, 3000], [4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-3000, 3000], [3, -3]);
  const still = useMotionValue(0);
  const x = useTransform(offset, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !active) return;
    const step = baseSpeed * (delta / 1000) * (1 + Math.abs(boost.get()));
    offset.set(wrap(-50, 0, offset.get() + step));
  });

  return { x, skew: reduce ? still : skew };
}
