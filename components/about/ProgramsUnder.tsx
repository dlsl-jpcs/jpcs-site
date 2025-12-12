"use client";
import React, { useEffect, useRef } from "react";

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
      bg: "bg-white/5 border-green-500/30",
      gradient: "from-green-400 to-emerald-500",
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
      bg: "bg-white/5 border-green-500/30",
      gradient: "from-green-400 to-emerald-500",
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
      bg: "bg-white/5 border-green-500/30",
      gradient: "from-green-400 to-emerald-500",
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
    <>
      <section
        ref={containerRef}
        className="relative py-6 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden"
      >

        <div className="relative text-center mb-16 md:mb-20">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Programs under{" "}
            <span className="text-light-green relative">
              JPCS
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
            </span>
          </h1>

          <h2 className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the cutting-edge degree programs under Junior Philippine
            Computer Society at De La Salle Lipa
          </h2>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-8">
          {programs.map((prog, index) => (
            <div key={prog.short} className="group relative">
              <div className="absolute -top-8 md:-top-6 left-1/2 transform -translate-x-1/2 z-10">
                <div
                  className={`relative w-15 h-15 rounded-full bg-gradient-to-br ${prog.gradient} p-0.5 shadow-lg shadow-green-500/20`}
                >
                  <div className="w-full h-full rounded-ful flex items-center justify-center">
                    <div
                      className={`text-gradient ${prog.gradient.replace(
                        "bg-",
                        "text-"
                      )} font-semibold`}
                    >
                      {prog.icon}
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-full border-2 border-white/30`}
                  ></div>
                </div>
              </div>

              <div
                className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${prog.gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
              ></div>

              <div
                className={`relative h-full ${prog.bg} backdrop-blur-sm border rounded-2xl p-6 sm:p-8 overflow-hidden pt-6 md:pt-10 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300`}
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
               

                <div className="relative">
                  <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-3 mt-5 leading-tight group-hover:text-green-400 transition-colors">
                    {prog.title}
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-center">
                    {prog.desc}
                  </p>
                </div>
              </div>

              <div
                className={`absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 ${prog.gradient
                  .replace("from-", "border-")
                  .replace(
                    " to-",
                    "-to-"
                  )} rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProgramsUnder;
