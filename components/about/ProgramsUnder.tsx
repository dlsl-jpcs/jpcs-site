"use client";
import { motion } from "framer-motion";

const programs = [
  {
    title: "Computer Science",
    short: "BSCS",
    desc: "Master algorithms, software engineering, AI, and advanced computing theories for research and tech leadership.",
  },
  {
    title: "Information Technology",
    short: "BSIT",
    desc: "Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.",
  },
  {
    title: "Computer Technology",
    short: "ACT",
    desc: "Two-year intensive program with foundational skills in programming, networking, and hardware.",
  },
];

const ProgramsUnder = () => {
  return (
    <section className="relative py-32 px-6 md:px-16 overflow-hidden bg-[#F4F4F5]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6">
            Degree{" "}
            <span className="bg-neon px-5 py-2 rounded-full inline-block transform rotate-2">
              Programs
            </span>
          </h2>
          <p className="text-navy/60 text-lg md:text-xl font-medium max-w-2xl">
            Explore the cutting-edge academic tracks under the Junior Philippine
            Computer Society.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, index) => (
            <motion.div
              key={prog.short}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-charcoal rounded-[2.5rem] p-10 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-neon/40 hover:shadow-[0_20px_50px_-10px_rgba(196,255,71,0.15)] flex flex-col"
            >
              <div className="absolute -bottom-4 -right-4 text-[8rem] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter group-hover:text-white/[0.05] transition-colors duration-500">
                {prog.short}
              </div>

              <div className="mb-10 relative z-10">
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 text-neon font-extrabold text-sm tracking-widest uppercase">
                  {prog.short}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight relative z-10">
                {prog.title}
              </h3>

              <p className="text-white/60 font-medium leading-relaxed relative z-10 mb-10 flex-grow">
                {prog.desc}
              </p>

              <div className="mt-auto flex items-center gap-4 text-white font-bold text-sm cursor-pointer relative z-10 group-hover:text-neon transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon group-hover:border-neon group-hover:text-navy transition-all duration-300 shadow-inner">
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="tracking-wide uppercase text-xs transform group-hover:translate-x-1 transition-transform duration-300">
                  Explore Track
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsUnder;
