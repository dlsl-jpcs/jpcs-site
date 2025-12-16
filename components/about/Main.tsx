"use client";

import React from "react";
import { motion } from "framer-motion";

const Main = () => {
  return (
    <section className="py-16 md:py-14  px-4 md:px-8 text-white relative overflow-hidden bg-accent-green">
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-black">
              About <span className="text-white">JPCS</span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-black rounded-full mt-2"
            ></motion.div>
          </div>

          {/* <p className="text-black/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Junior Philippine Computer Society
          </p> */}
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-center text-black font-semibold text-md md:text-2xl leading-relaxed">
              JPCS is a professional organization of ICT students which aims to
              provide knowledge and skills significant to the students once they
              enter the academe and industry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-center text-black font-semibold text-md md:text-2xl leading-relaxed">
              JPCS provides wide opportunities and experiences which will
              encourage collaboration and healthy competition among its members.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
