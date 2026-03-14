"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Events from "./events/Events";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      className="relative min-h-screen w-full bg-navy flex items-center justify-center overflow-hidden z-0"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[95%] sm:max-w-[95%] md:max-w-6xl lg:max-w-7xl xl:max-w-8xl mx-auto px-3 min-[401px]:px-5 sm:px-6 relative z-10 w-full pt-20 min-[401px]:pt-24 lg:pt-14 pb-12 min-[401px]:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-[401px]:gap-12 lg:gap-8 items-center">
        
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

            <p className="text-sm min-[401px]:text-base md:text-lg text-white/60 max-w-md mt-3 min-[401px]:mt-4 leading-relaxed font-medium md:ml-6 lg:ml-2">
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
