"use client";

import React from "react";
import { motion } from "framer-motion";

const Main = () => {
  return (
    <section className="py-10 md:py-20 px-4 md:px-8 text-white relative overflow-hidden bg-gradient-to-b from-[#0d0d0d] to-[#0e0e0e]">
      <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-accent-green/5 rotate-45 transform"></div>
      <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-accent-green/5 rotate-45 transform blur-3xl"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-light-green/3 rotate-12 transform blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div className="relative group">
              <div className="absolute -inset-4"></div>

              <div className="relative backdrop-blur-sm rounded-full p-4 transition-all duration-500 overflow-hidden">

                <div className="relative flex items-center justify-center">
                  <img
                    src="/jpcslogo.png"
                    alt="JPCS Logo"
                    className="w-[60%] md:w-[70%] h-auto transform group-hover:scale-105 transition-all duration-500 drop-shadow-2xl"
                  />
                </div>

                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent-green/40 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-light-green/40 rounded-bl-lg"></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-gradient-to-r from-dark-green/20 to-accent-green/10 text-accent-green rounded-lg text-sm font-medium border border-accent-green/30 backdrop-blur-sm">
                  PROFESSIONAL ORGANIZATION
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left leading-tight">
                <span className="text-white block">Junior Philippine</span>
                <span className="bg-gradient-to-r from-light-green via-accent-green to-dark-green bg-clip-text text-transparent">
                  Computer Society
                </span>
              </h2>

              {/* <div className="hidden md:flex items-center gap-3 mt-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-accent-green/30"></div>
                <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse"></div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-accent-green/30 to-transparent"></div>
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/10 group-hover:border-accent-green/40 transition-all duration-500">
                <div className="space-y-6">
                  <p className="text-gray-200 text-lg leading-relaxed">
                    <span className="font-semibold text-accent-green">
                      JPCS
                    </span>{" "}
                    is a professional organization of ICT students which aims to
                    provide knowledge and skills significant to the students
                    once they enter the academe and industry.
                  </p>

                  <div className="relative pl-5 border-l-2 border-accent-green/40">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-accent-green rounded-full"></div>

                    <p className="text-gray-300 leading-relaxed">
                      JPCS provides wide opportunities and experiences which
                      will encourage collaboration and healthy competition among
                      its members.
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-6 h-0.5 bg-gradient-to-r from-accent-green to-light-green rounded-full"></div>
                      <div className="text-xs text-gray-400 font-medium">
                        Building Future IT Leaders
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-accent-green/30"></div>
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-light-green/30"></div>
              </div>

              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-green/20 to-light-green/20 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-accent-green/30 to-transparent mt-12 md:mt-16"
        ></motion.div> */}
      </div>
    </section>
  );
};

export default Main;
