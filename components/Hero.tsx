"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Events from "./events/Events";
import ShinyText from "./ShinyText";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Array<{ x: number; y: number; baseOpacity: number }>>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate dot positions into a ref — no setState, no re-renders
  useEffect(() => {
    const generateDots = () => {
      const gridSize = window.innerWidth < 768 ? 35 : 25;
      const newDots: Array<{ x: number; y: number; baseOpacity: number }> = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      const fadeStartY = window.innerHeight * 0.75;

      for (let x = 0; x < window.innerWidth; x += gridSize) {
        for (let y = 0; y < window.innerHeight; y += gridSize) {
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          let baseOpacity = Math.max(
            0.08,
            Math.min(0.85, 1 - (distance / maxDistance) * 1.1)
          );
          if (y > fadeStartY) {
            const progress = (y - fadeStartY) / (window.innerHeight - fadeStartY);
            baseOpacity *= 1 - progress * 0.5;
          }
          newDots.push({ x, y, baseOpacity: Math.max(0.06, baseOpacity) });
        }
      }

      dotsRef.current = newDots;

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    generateDots();
    window.addEventListener("resize", generateDots);
    return () => window.removeEventListener("resize", generateDots);
  }, [isMobile]);

  // Canvas RAF loop — single draw call per frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const DOT_RADIUS = 1.5;
    const HOVER_RADIUS = 200;
    const SCALE_RADIUS = 140;
    const GLOW_RADIUS = 200;

    const animate = () => {
      const dots = dotsRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let opacity = dot.baseOpacity;
        let radius = DOT_RADIUS;
        let glowSize = 0;
        let glowOpacity = 0;

        if (mouse) {
          const dx = mouse.x - dot.x;
          const dy = mouse.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= HOVER_RADIUS) {
            opacity = Math.max(dot.baseOpacity, (1 - dist / HOVER_RADIUS) * 0.9);

            if (dist <= SCALE_RADIUS) {
              radius = DOT_RADIUS * (1 + (1 - dist / SCALE_RADIUS) * 3);
            }

            if (dist <= GLOW_RADIUS) {
              const gi = 1 - dist / GLOW_RADIUS;
              glowSize = gi * 12;
              glowOpacity = gi * 0.6;
            }
          }
        }

        ctx.save();
        if (glowSize > 0) {
          ctx.shadowColor = `rgba(34, 197, 94, ${glowOpacity})`;
          ctx.shadowBlur = glowSize;
        }
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#005a26";
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []); // canvas is in the DOM from mount — no isVisible gate needed

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.8, ease: "backOut" as const },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(34, 197, 94, 0.9)",
      transition: { duration: 0.2 },
    },
  };

  const eventsVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <motion.section
      id="home"
      className="min-h-screen w-screen overflow-hidden flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        ref={containerRef}
        className="min-h-screen w-screen bg-background relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variants={containerVariants}
      >
        {/* Canvas dot grid — always mounted, RAF starts immediately */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0"
        />

        <motion.div
          className="relative z-10 flex items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-2"
          variants={staggerVariants}
        >
          <div className="w-full max-w-[95%] sm:max-w-[95%] md:max-w-6xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-0 items-center">
              <motion.div
                className="flex flex-col items-center text-center lg:items-start lg:text-left order-1 lg:order-1"
                variants={staggerVariants}
              >
                <div className="w-full ml-3">
                  <motion.h1
                    className="text-4xl sm:text-4xl md:text-[55px] lg:pl-4 xl:pl-5 font-bold text-foreground mb-4 sm:mb-4 tracking-tight leading-[1] mt-20 md:mt-15"
                    variants={textVariants}
                  >
                    Junior Philippines{" "}
                    <motion.span
                      className="text-light-green"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    >
                      Computer Society
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-foreground mb-4 sm:mb-6 md:ml-6"
                    variants={textVariants}
                  >
                    De La Salle Lipa Chapter
                  </motion.p>

                  <motion.div
                    className="mb-4 sm:mb-6 md:ml-6"
                    variants={textVariants}
                  >
                    <ShinyText
                      text="Exploring limitless opportunities through innovation"
                      disabled={false}
                      speed={3}
                      className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl"
                    />
                  </motion.div>

                  <motion.div
                    className="inline-block bg-light-green text-background font-bold border-2 border-light-green px-3 sm:px-4 md:px-3 md:ml-6 py-2 rounded-full text-sm sm:text-sm md:text-xs lg:text-sm xl:text-sm 2xl:text-xl"
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    #TatakJPCS
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center order-2 lg:order-2"
                variants={eventsVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
              >
                <Events events={events} isMobile={isMobile} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
