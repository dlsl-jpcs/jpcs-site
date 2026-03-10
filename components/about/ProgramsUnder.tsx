"use client";
import { motion } from "framer-motion";

const programs = [
  {
    title: "Bachelor of Science in Computer Science",
    short: "BSCS",
    desc: "Master algorithms, software engineering, AI, and advanced computing theories for research and tech leadership.",
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
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Bachelor of Science in Information Technology",
    short: "BSIT",
    desc: "Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.",
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
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    title: "Associate in Computer Technology",
    short: "ACT",
    desc: "Two-year intensive program with foundational skills in programming, networking, and hardware.",
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
        />
      </svg>
    ),
  },
];

const ProgramsUnder = () => {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 w-full mx-auto overflow-hidden bg-background">
      {/* Simple radial glow — replaces complex animated SVG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(13,204,88,0.08), transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto px-0 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-light-green text-xs font-semibold tracking-widest uppercase border border-light-green/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-light-green" />
            Degree Programs
          </span>
          <div className="inline-block">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Programs Under <span className="text-light-green">JPCS</span>
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-0.5 bg-light-green rounded-full mt-3"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/50 text-sm md:text-lg font-medium max-w-2xl mx-auto mt-4"
          >
            Explore the cutting-edge degree programs under Junior Philippine
            Computer Society at De La Salle Lipa
          </motion.p>
        </motion.div>

        {/* Program cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-8 w-full">
          {programs.map((prog, index) => (
            <motion.div
              key={prog.short}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Floating icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 z-10"
              >
                <div className="w-14 h-14 rounded-full bg-background border-2 border-light-green/40 flex items-center justify-center shadow-lg group-hover:border-light-green/80 transition-colors duration-300">
                  <div className="text-light-green">{prog.icon}</div>
                </div>
              </motion.div>

              <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden pt-12 md:pt-14 p-6 sm:p-8 hover:border-light-green/30 hover:shadow-[0_0_30px_rgba(13,204,88,0.08)] transition-all duration-300">
                {/* Top accent strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #0dcc58, transparent)",
                  }}
                />

                {/* Short name badge */}
                <span className="absolute top-4 right-4 text-xs font-bold text-light-green border border-light-green/30 rounded-full px-2.5 py-0.5">
                  {prog.short}
                </span>

                {/* Watermark */}
                <span className="absolute bottom-3 right-4 text-6xl font-black text-white/[0.04] select-none pointer-events-none leading-none">
                  {prog.short}
                </span>

                <div className="relative text-center">
                  <h2 className="text-base sm:text-lg font-bold text-white mb-3 leading-snug">
                    {prog.title}
                  </h2>
                  <p className="text-white/55 leading-relaxed text-sm">
                    {prog.desc}
                  </p>
                </div>
              </div>

              {/* Corner accent on hover */}
              <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-2 border-r-2 border-light-green rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsUnder;
