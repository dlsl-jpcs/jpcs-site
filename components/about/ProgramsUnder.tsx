"use client";
import React, { useEffect, useRef } from "react";

const ProgramsUnder = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = [
      "bg-green-500",
      "bg-black",
      "bg-emerald-400",
      "bg-gray-800",
    ];
    const shapes = ["rounded-full", "rounded-lg", "rounded-3xl"];

    for (let i = 0; i < 20; i++) {
      const bit = document.createElement("div");
      const size = Math.random() * 12 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      bit.className = `absolute ${color} ${shape} opacity-10 animate-float pointer-events-none`;
      bit.style.width = `${size}px`;
      bit.style.height = `${size}px`;
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.top = `${Math.random() * 100}%`;
      bit.style.animationDelay = `${Math.random() * 5}s`;
      bit.style.animationDuration = `${Math.random() * 10 + 10}s`;

      container.appendChild(bit);
    }

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
      bg: "from-green-50 to-emerald-50 border-green-200",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Bachelor of Science in Information Technology",
      short: "BSIT",
      desc: "Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.",
      bg: "from-emerald-50 to-teal-50 border-emerald-200",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      title: "Associate in Computer Technology",
      short: "ACT",
      desc: "Two-year intensive program with foundational skills in programming, networking, and hardware.",
      bg: "from-teal-50 to-cyan-50 border-teal-200",
      gradient: "from-teal-400 to-cyan-500",
    },
  ];

  return (
    <>
      <section
        ref={containerRef}
        className="relative py-6 sm:py-10 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Programs under{" "}
            <span className="gradient-text relative">
              JPCS
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></span>
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the cutting-edge degree programs under Junior Philippine
            Computer Society at De La Salle Lipa
          </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((prog, index) => (
            <div key={prog.short} className="group relative">
              <div
                className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${prog.gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
              ></div>

              <div
                className={`card-hover relative h-full bg-gradient-to-br ${prog.bg} border-2 border-gray-100 rounded-2xl p-6 sm:p-8 overflow-hidden glow`}
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${prog.gradient} opacity-5 rounded-tr-2xl`}
                ></div>

                <div className="relative">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors">
                    {prog.title}
                  </h2>

                  <p className="text-gray-600 mb-3 leading-relaxed">
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
