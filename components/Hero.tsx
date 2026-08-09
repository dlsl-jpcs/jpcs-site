"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Events from "./events/Events";
import DotField from "./DotField";

interface UpcomingEvent {
  org: string;
  title: string;
  date: string;
  time: string;
  description: string;
  link: string;
  image: string;
  facebook: string;
  instagram: string;
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch("/api/upcomingEvents");
        const data = await response.json();
        setUpcomingEvents(data.data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const events = [
    ...upcomingEvents.map((event) => ({
      org: event.org,
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description,
      link: event.link,
      image: event.image,
      facebook: event.facebook,
      instagram: event.instagram,
    })),
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen w-full bg-navy flex items-center justify-center overflow-hidden z-0"
    >
      {/* DotField background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DotField
          dotRadius={1.5}
          dotSpacing={12}
          bulgeStrength={67}
          glowRadius={160}
          sparkle
          waveAmplitude={3}
          cursorRadius={450}
          cursorForce={1}
          bulgeOnly
          gradientFrom="#0200c7"
          gradientTo="#4ae609"
          glowColor="transparent"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[95%] sm:max-w-[95%] md:max-w-6xl lg:max-w-7xl xl:max-w-8xl mx-auto px-3 min-[401px]:px-5 sm:px-6 relative z-10 w-full pt-20 min-[401px]:pt-24 lg:pt-14 pb-12 min-[401px]:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-[401px]:gap-8 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left order-1 lg:order-1 ml-0 lg:ml-3"
          >
            <h1 className="text-4xl min-[401px]:text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold leading-[1.1] text-white tracking-tight mb-3 min-[401px]:mb-4">
              Junior Philippine
              <br />
              Computer Society
              <br />
              <span className="inline-block bg-neon text-navy px-3 min-[401px]:px-4 sm:px-6 py-1.5 min-[401px]:py-2 mt-3 min-[401px]:mt-4 sm:mt-5 rounded-full shadow-[0_0_40px_rgba(196,255,71,0.25)] transform -rotate-2 text-xl min-[401px]:text-3xl sm:text-5xl md:text-6xl">
                De La Salle Lipa
              </span>
            </h1>

            <p className="text-sm min-[401px]:text-[16px] md:text-lg text-white/60 max-w-md mt-3 min-[401px]:mt-2 leading-relaxed font-medium md:ml-6 lg:ml-2">
              Exploring limitless opportunities through innovation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center order-2 lg:order-2 w-full"
          >
            <Events events={events} isMobile={isMobile} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
