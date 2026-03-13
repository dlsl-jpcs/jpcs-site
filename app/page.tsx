"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import About from "@/components/about/About";
import Banner from "@/components/Banner";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Officers from "@/components/officers/Officers";
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
      },
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="w-full relative selection:bg-neon selection:text-navy">
      <ScrollProgressBar />
      <Navbar />

      <div ref={heroSectionRef}>
        <Hero />
      </div>

      <Banner />

      {isAboutVisible && <About />}

      {isAboutVisible && <Officers />}

      <Announcements />
    </main>
  );
}
