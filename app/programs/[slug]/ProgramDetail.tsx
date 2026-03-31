"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Program } from "@/data/programs";

export default function ProgramDetail({ program }: { program: Program }) {
  return (
    <div className="min-h-screen bg-charcoal">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-navy to-charcoal px-6 md:px-16 py-16 md:py-24 overflow-hidden border-b-2 border-neon"
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        {/* Ghost watermark */}
        <div className="absolute -bottom-4 -right-8 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter">
          {program.short}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back navigation */}
          <Link
            href="/#programs"
            onClick={() => sessionStorage.setItem("scrollTo", "#programs")}
            className="flex items-center gap-2 text-white/50 hover:text-neon transition-colors duration-200 text-sm font-medium mb-8 w-fit"
          >
            <span>←</span>
            <span>Back to Degree Programs</span>
          </Link>

          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 text-neon font-extrabold text-sm tracking-widest uppercase mb-6">
            {program.short}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {program.title}
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            {program.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Duration", value: program.duration },
              { label: "Award", value: program.degree },
              { label: "Accreditation", value: program.accreditation },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-center"
              >
                <div className="text-neon font-extrabold text-lg">
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sections */}
      <div className="bg-off-white px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {/* Program Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-charcoal rounded-3xl p-8 md:p-10 border border-white/5"
          >
            <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-4">
              Program Overview
            </p>
            <p className="text-white/70 leading-relaxed text-base md:text-lg">
              {program.overview}
            </p>
          </motion.div>

          {/* Core Curriculum */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-charcoal rounded-3xl p-8 md:p-10 border border-white/5"
          >
            <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
              Core Curriculum
            </p>
            <div className="flex flex-wrap gap-3">
              {program.curriculum.map((subject) => (
                <span
                  key={subject}
                  className="bg-charcoal-light border border-white/10 text-white/80 text-sm px-4 py-2 rounded-xl"
                >
                  {subject}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Career Paths + Why Choose — 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-charcoal rounded-3xl p-8 border border-white/5"
            >
              <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
                Career Paths
              </p>
              <ul className="flex flex-col gap-3">
                {program.careers.map((career) => (
                  <li
                    key={career}
                    className="flex items-center gap-3 text-white/80 text-sm"
                  >
                    <span className="text-neon font-bold flex-shrink-0">→</span>
                    {career}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-charcoal rounded-3xl p-8 border border-white/5"
            >
              <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
                Why Choose {program.short}?
              </p>
              <div className="flex flex-col gap-4">
                {program.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="bg-charcoal-light rounded-xl p-4 border-l-2 border-neon"
                  >
                    <p className="text-white font-bold text-sm mb-1">{h.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
