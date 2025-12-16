"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Main = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-14  px-4 md:px-8 text-white relative overflow-hidden bg-accent-green">
      <div className="absolute -top-1/4 -right-1/4  w-[550px] h-[550px] md:w-[800px] md:h-[800px] bg-black/5 rotate-45 transform"></div>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #000000 1px, transparent 1px),
                           linear-gradient(to bottom, #000000 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-black">
              About <span className="text-white">JPCS</span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-black rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-center text-black font-semibold text-md md:text-2xl leading-relaxed">
              JPCS is a professional organization of ICT students which aims to
              provide knowledge and skills significant to the students once they
              enter the academe and industry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-center text-black font-semibold text-md md:text-2xl leading-relaxed">
              JPCS provides wide opportunities and experiences which will
              encourage collaboration and healthy competition among its members.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-black/70 text-xs md:text-sm font-medium italic">
            Shaping the future of technology, one student at a time
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Main;