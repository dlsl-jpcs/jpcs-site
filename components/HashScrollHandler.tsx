"use client";

import { useEffect } from "react";

const CORRECTION_WINDOW_MS = 3000;
const RETRY_INTERVAL_MS = 100;

export default function HashScrollHandler() {
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    let retryIntervalId: ReturnType<typeof setInterval> | null = null;
    let stopTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const getTarget = () => {
      const hash = window.location.hash;
      if (!hash) return null;
      return document.getElementById(hash.slice(1));
    };

    const alignToTarget = (behavior: ScrollBehavior) => {
      const el = getTarget();
      if (!el) return false;
      el.scrollIntoView({ behavior, block: "start" });
      return true;
    };

    const cleanup = () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (retryIntervalId) clearInterval(retryIntervalId);
      if (stopTimeoutId) clearTimeout(stopTimeoutId);
      retryIntervalId = null;
      stopTimeoutId = null;
    };

    const startCorrectionWindow = () => {
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(() => {
        alignToTarget("auto");
      });
      resizeObserver.observe(document.body);

      if (stopTimeoutId) clearTimeout(stopTimeoutId);
      stopTimeoutId = setTimeout(() => {
        resizeObserver?.disconnect();
      }, CORRECTION_WINDOW_MS);
    };

    const handleNavigation = () => {
      cleanup();

      if (!window.location.hash) return;

      // Try immediately first
      if (alignToTarget("smooth")) {
        startCorrectionWindow();
        return;
      }

      // Target not mounted yet — poll until it appears (or give up)
      const startedAt = Date.now();
      retryIntervalId = setInterval(() => {
        if (alignToTarget("auto")) {
          if (retryIntervalId) clearInterval(retryIntervalId);
          startCorrectionWindow();
          return;
        }
        if (Date.now() - startedAt > CORRECTION_WINDOW_MS) {
          if (retryIntervalId) clearInterval(retryIntervalId);
        }
      }, RETRY_INTERVAL_MS);
    };

    handleNavigation();
    window.addEventListener("hashchange", handleNavigation);

    return () => {
      window.removeEventListener("hashchange", handleNavigation);
      cleanup();
    };
  }, []);

  return null;
}
