"use client";

import { useEffect, useRef, useState } from "react";
import About from "@/components/about/About";
import Officers from "@/components/officers/Officers";

export default function LazySections() {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the URL hash targets content inside the lazy sections, load immediately.
    if (window.location.hash) {
      setIsVisible(true);
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "200px 0px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // After lazy sections mount, scroll to the hash target if present.
  useEffect(() => {
    if (!isVisible) return;
    const hash = window.location.hash;
    if (!hash) return;
    const timer = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      {isVisible && <About />}
      {isVisible && <Officers />}
    </>
  );
}
