"use client";

import { MotionConfig } from "framer-motion";

/** Turns off framer-motion's movement for visitors who ask their OS for reduced motion. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
