"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import About from "@/components/about/About";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const Announcements = dynamic(() => import("@/components/Announcements"), {
  ssr: false,
});

export default function Home() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAboutVisible(true);
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

    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-figtree items-center justify-items-center min-h-screen w-full">
      <ScrollProgressBar />
      <Navbar />

      <div ref={heroSectionRef}>
        <Hero />
      </div>

      {isAboutVisible && <About />}

      <Announcements />
    </div>
  );
}
