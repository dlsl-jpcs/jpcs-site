"use client";
import { useState, useEffect, useRef } from "react";
import Events from "./Events";
import ShinyText from "./ShinyText";

export default function Hero() {
  const [dots, setDots] = useState<
    Array<{ x: number; y: number; baseOpacity: number }>
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number>(0);

  const gridSize = 25;
  const dotRadius = 1.5;
  const hoverRadius = 200;
  const scaleRadius = 140;
  const glowRadius = 200;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const generateDots = () => {
      const mobileGridSize = isMobile ? 35 : 25;
      const newDots = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

      for (let x = 0; x < window.innerWidth; x += mobileGridSize) {
        for (let y = 0; y < window.innerHeight; y += mobileGridSize) {
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          const baseOpacity = Math.max(
            0.05,
            Math.min(0.8, 1 - (distance / maxDistance) * 1.2)
          );
          newDots.push({ x, y, baseOpacity });
        }
      }

      setDots(newDots);
    };

    generateDots();
    window.addEventListener("resize", generateDots);
    return () => window.removeEventListener("resize", generateDots);
  }, [isMobile]);

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current;
      const mouse = mouseRef.current;
      if (!container || !mouse) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const children = container.querySelectorAll<HTMLDivElement>(".dot");

      children.forEach((dotEl, index) => {
        const dot = dots[index];
        if (!dot) return;

        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let opacity = dot.baseOpacity;
        let scale = 1;
        let boxShadow = "none";

        if (distance <= hoverRadius) {
          const hoverIntensity = 1 - distance / hoverRadius;
          const hoverOpacity = hoverIntensity * 0.9;
          opacity = Math.max(dot.baseOpacity, hoverOpacity);

          if (distance <= scaleRadius) {
            const scaleIntensity = 1 - distance / scaleRadius;
            scale = 1 + scaleIntensity * 3;
          }

          if (distance <= glowRadius) {
            const glowIntensity = 1 - distance / glowRadius;
            const glowSize = glowIntensity * 12;
            const glowOpacity = glowIntensity * 0.6;
            boxShadow = `0 0 ${glowSize}px rgba(34, 197, 94, ${glowOpacity})`;
          }
        }

        dotEl.style.opacity = `${opacity}`;
        dotEl.style.transform = `scale(${scale})`;
        dotEl.style.boxShadow = boxShadow;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dots]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY };
    mouseRef.current = pos;
  };

  const handleMouseLeave = () => {
    mouseRef.current = null;
  };

  const events = [
    {
      org: "JPCS DLSL",
      title: "IQnecct",
      date: "September 30, 2023",
      time: "2:30 PM - 5:00 PM",
      description:
        "An exciting quiz bee that will challenge your wit, speed, and teamwork! Test your knowledge on technology, general information, and problem-solving while competing with the best minds on campus. Prizes, fun, and bragging rights await! ",
      link: "https://forms.example.com/techsummit2023",
      image: "/tech-summit.jpg",
      facebook: "https://facebook.com/jpcsdlsl/posts/techsummit2023",
      instagram: "https://instagram.com/jpcsdlsl/posts/techsummit2023",
    },
    {
      org: "JPCS DLSL",
      title: "CodeFest Hackathon",
      date: "December 2-3, 2023",
      time: "24-hour event starting at 10:00 AM",
      description:
        "Competitive coding marathon where participants develop innovative solutions to real-world problems. Open to all skill levels with prizes for winners.",
      link: "https://forms.example.com/codefest2023",
      image: "/hackathon.jpg",
      facebook: "https://facebook.com/jpcsdlsl/posts/codefest2023",
      instagram: "https://instagram.com/jpcsdlsl/posts/codefest2023",
    },
    {
      org: "JPCS DLSL",
      title: "Web Development Workshop",
      date: "October 28, 2023",
      time: "1:00 PM - 4:00 PM",
      description:
        "Hands-on workshop covering modern web development technologies including React, Node.js, and responsive design principles.",
      link: "https://forms.example.com/webdevworkshop",
      image: "/web-dev.jpg",
      facebook: "https://facebook.com/jpcsdlsl/posts/webdevworkshop",
      instagram: "https://instagram.com/jpcsdlsl/posts/webdevworkshop",
    },
    {
      org: "JPCS DLSL",
      title: "Cyber Security Awareness Seminar",
      date: "November 10, 2023",
      time: "2:00 PM - 4:00 PM",
      description:
        "Learn about online safety, data protection, and cybersecurity best practices from industry experts in this informative seminar.",
      link: "https://forms.example.com/cybersecurity2023",
      image: "/cybersecurity.jpg",
      facebook: "https://facebook.com/jpcsdlsl/posts/cybersecurity2023",
      instagram: "https://instagram.com/jpcsdlsl/posts/cybersecurity2023",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen w-screen overflow-hidden flex items-center justify-center"
    >
      <div
        ref={containerRef}
        className="min-h-screen w-screen bg-background relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[35%_65%] md:grid-cols-[40%_60%] max-w-7xl mx-auto  sm:p-4 mt-30 md:mt-10 gap-0 md:gap-8 ">
          {/* Left Text Section */}
          <div className="flex flex-col justify-center items-center text-center sm:items-center sm:text-center md:items-start md:text-left mt-8 sm:mt-12 md:mt-20 px-2 sm:px-4 md:px-0">
            <h1 className="text-5xl sm:text-4xl md:text-[55px] font-bold text-foreground mb-4 tracking-tight md:border-l-2 md:border-l-white/50 md:pl-3">
              Junior Philippines{" "}
              <span className="text-light-green">Computer Society</span>
            </h1>
            <p className="text-2xl sm:text-2xl md:text-3xl text-foreground mb-4">
              De La Salle Lipa Chapter
            </p>
            <ShinyText
              text="Exploring limitless opportunities through innovation"
              disabled={false}
              speed={3}
              className="custom-class"
            />
            <p className="text-md sm:text-sm md:text-base text-foreground opacity-80"></p>
            <p className="text-xs sm:text-sm md:text-sm bg-light-green text-background font-bold opacity-80 mt-3 border-2 border-light-green px-2 sm:px-3 md:px-2 py-1 md:py-2 rounded-full">
              #TatakJPCS
            </p>
          </div>

          {/* Right Card Section */}
          <div className="flex items-center justify-center sm:items-center sm:justify-center md:items-start md:justify-end pr-4 md:pr-8">
            <Events events={events} isMobile={isMobile} />
          </div>
        </div>

        {/* Dot Grid */}
        {dots.map((dot, index) => (
          <div
            key={index}
            className="absolute dot rounded-full bg-dark-green pointer-events-none will-change-transform transition-opacity duration-150 ease-out z-0"
            style={{
              left: dot.x - dotRadius,
              top: dot.y - dotRadius,
              width: dotRadius * 2,
              height: dotRadius * 2,
              opacity: dot.baseOpacity,
              transform: "scale(1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
