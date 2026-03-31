"use client";

import { useEffect, useRef, useState } from "react";
import About from "@/components/about/About";
import Officers from "@/components/officers/Officers";

export default function LazySections() {
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If an explicit scroll target was set (e.g. from the back link on a
    // program detail page), load the lazy sections immediately.
    if (sessionStorage.getItem("scrollTo")) {
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

  // After lazy sections mount, scroll to the intended target and clear the flag.
  useEffect(() => {
    if (!isVisible) return;
    const target = sessionStorage.getItem("scrollTo");
    if (!target) return;
    sessionStorage.removeItem("scrollTo");
    const timer = setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
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
