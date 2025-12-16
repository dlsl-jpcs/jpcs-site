"use client";

import { useState, useEffect, useRef } from "react";
import About from "@/components/about/About";
import Announcements from "@/components/Announcements";
import Banner from "@/components/Banner";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function Home() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const minimumLoadTime = setTimeout(() => {
      setHeroLoaded(true);
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(minimumLoadTime);
    };
  }, []);

  useEffect(() => {
    if (!heroLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeoutRef.current = setTimeout(() => {
              setIsAboutVisible(true);
            }, 500);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px 0px 0px",
      }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSectionRef.current);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [heroLoaded]);

  return (
    <div className="font-figtree items-center justify-items-center min-h-screen w-full">
      <ScrollProgressBar />
      <Navbar />

      <div ref={heroSectionRef}>
        <Hero />
      </div>

      {isAboutVisible && <About />}

      <Announcements />

      {!isAboutVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="animate-pulse text-xs text-gray-400">
            Loading content...
          </div>
        </div>
      )}
    </div>
  );
}
