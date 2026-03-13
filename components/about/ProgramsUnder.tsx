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
    <section className="relative py-20 px-6 md:px-16 overflow-hidden bg-[#F4F4F5]">
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
              className="group relative bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_-10px_rgba(11,19,43,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(11,19,43,0.12)] transition-all duration-500 hover:-translate-y-2 border border-navy/5"
            >
              <div className="absolute top-0 left-10 right-10 h-1.5 bg-neon rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="mb-10">
                <span className="text-6xl font-black text-navy/5 group-hover:text-neon/30 transition-colors duration-500 tracking-tighter">
                  {prog.short}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-navy mb-4 leading-tight">
                {prog.title}
              </h3>
              <p className="text-charcoal/60 font-medium leading-relaxed">
                {prog.desc}
              </p>

              <div className="mt-10 flex items-center gap-2 text-navy font-bold text-sm group-hover:text-[#9fe619] transition-colors duration-300 cursor-pointer">
                Explore Track
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsUnder;
