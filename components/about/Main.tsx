"use client";

import React from "react";
import { motion } from "framer-motion";

const Main = () => {
  return (
    <section className="py-10 md:py-20 px-4 md:px-8 text-white relative overflow-hidden bg-[#0d0d0d]">
      <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-accent-green/5 rotate-45 transform"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-5 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="/jpcslogo.png"
                alt="JPCS Logo"
                className="w-[40%] lg:w-[70%] mx-auto h-auto transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-2xl relative z-10"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-green/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 opacity-0 hover:opacity-100 z-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="text-center md:text-left lg:text-left">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-dark-green/20 to-accent-green/10 text-accent-green rounded-lg text-sm font-medium mb-6 border border-dark-green/30"
                >
                  PROFESSIONAL ORGANIZATION
                </motion.span>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center md:text-start"
              >
                <span className="text-white ">Junior Philippine</span>
                <br />
                <span className="bg-gradient-to-r from-light-green via-accent-green to-dark-green bg-clip-text text-transparent">
                  Computer Society
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-accent-green/30 transition-all duration-500"
              >
                <div className="space-y-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    <span className="font-semibold text-accent-green">
                      JPCS
                    </span>{" "}
                    is a professional organization of ICT students which aims to
                    provide knowledge and skills significant to the students
                    once they enter the academe and industry.
                  </p>
                  <div className="relative">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-accent-green to-light-green mb-4" />
                    <p className="text-gray-400 leading-relaxed pl-4 border-l-2 border-dark-green/30">
                      JPCS provides wide opportunities and experiences which
                      will encourage collaboration and healthy competition among
                      its members.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Main;
