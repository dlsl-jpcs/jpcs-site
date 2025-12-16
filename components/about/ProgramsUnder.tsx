"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ProgramsUnder = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    return () => {
      const bits = container.querySelectorAll('[class*="animate-float"]');
      bits.forEach((bit: Element) => bit.remove());
    };
  }, []);

  const programs = [
    {
      title: "Bachelor of Science in Computer Science",
      short: "BSCS",
      desc: "Master algorithms, software engineering, AI, and advanced computing theories for research and tech leadership.",
      gradient: "from-accent-green to-accent-green",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          ></path>
        </svg>
      ),
    },
    {
      title: "Bachelor of Science in Information Technology",
      short: "BSIT",
      desc: "Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.",
      gradient: "from-accent-green to-accent-green",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          ></path>
        </svg>
      ),
    },
    {
      title: "Associate in Computer Technology",
      short: "ACT",
      desc: "Two-year intensive program with foundational skills in programming, networking, and hardware.",
      gradient: "from-accent-green to-accent-green",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-6 sm:py-10 px-4 sm:px-6 w-full mx-auto overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1400 900"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="centerFade">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="60%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="dotGlow">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#centerFade)" />
          </mask>

          <g
            mask="url(#fadeMask)"
            stroke="#10b981"
            strokeWidth="1.4"
            fill="none"
          >
            {[120, 260, 400, 540, 680, 780].map((y, i) => (
              <path
                key={`h${i}`}
                d={`M-200,${y} Q400,${y + 80 * Math.sin(i + 1)} 700,${
                  y + 50
                } T1400,${y + 30 * Math.cos(i)}`}
                opacity="0.28"
              />
            ))}

            {[200, 500, 800, 1100].map((x, i) => (
              <path
                key={`v${i}`}
                d={`M${x},0 Q${x + 120 * Math.sin(i + 2)},300 ${x - 60},600 T${
                  x + 50
                },900`}
                opacity="0.22"
              />
            ))}
          </g>

          <g>
            <circle r="5" fill="url(#dotGlow)">
              <animateMotion
                path="M100,200 Q500,100 900,300 T1300,200 T1300,600 T900,750 T100,700 T100,200"
                dur="30s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="4" fill="url(#dotGlow)">
              <animateMotion
                path="M300,700 Q700,800 1100,650"
                dur="26s"
                repeatCount="indefinite"
                begin="7s"
              />
            </circle>
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-3 md:py-5 max-w-6xl mx-auto px-6 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Programs under{" "}
            <span className="text-light-green relative">
              JPCS
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-light-green to-emerald-500 rounded-full"
              ></motion.span>
            </span>
          </h1>

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore the cutting-edge degree programs under Junior Philippine
            Computer Society at De La Salle Lipa
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-8">
          {programs.map((prog, index) => (
            <motion.div
              key={prog.short}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="absolute -top-8 md:-top-6 left-1/2 transform -translate-x-1/2 z-10"
              >
                <div
                  className={`relative w-15 h-15 rounded-full bg-gradient-to-br ${prog.gradient} p-0.5 shadow-lg shadow-green-500/20`}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-black">
                    <div className="text-green-400">{prog.icon}</div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                </div>
              </motion.div>

              <div
                className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${prog.gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
              ></div>

              <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden pt-12 md:pt-16 hover:border-green-500/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group-hover:shadow-green-500/20">
                <div className="relative text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight"
                  >
                    {prog.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    className="text-gray-300 leading-relaxed"
                  >
                    {prog.desc}
                  </motion.p>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-light-green rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsUnder;
