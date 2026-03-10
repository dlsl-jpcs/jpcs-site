"use client";

import { motion } from "framer-motion";

const Main = () => {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 px-6 md:px-16 overflow-hidden bg-background"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0dcc58 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 text-light-green text-xs font-semibold tracking-widest uppercase border border-light-green/30 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-light-green" />
            About Us
          </span>
        </motion.div>

        {/* 2-column content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
              About <br />
              <span className="text-light-green">JPCS</span>
            </h2>
            <p className="mt-5 text-white/40 text-sm md:text-base italic leading-relaxed">
              Shaping the future of technology,
              <br />
              one student at a time
            </p>
          </motion.div>

          {/* Right: description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-l-2 border-light-green/30 pl-8 space-y-5 lg:pt-2"
          >
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              JPCS is a professional organization of ICT students which aims to
              provide knowledge and skills significant to the students once they
              enter the academe and industry.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              JPCS provides wide opportunities and experiences which will
              encourage collaboration and healthy competition among its members.
            </p>
          </motion.div>
        </div>


      </div>
    </section>
  );
};

export default Main;
