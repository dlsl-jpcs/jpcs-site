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
        className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-navy to-charcoal py-24 overflow-hidden"
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        {/* Ghost watermark */}
        <div className="absolute -bottom-4 -right-8 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter">
          {program.short}
        </div>

        <div className="relative z-10 w-full px-6 md:px-16 max-w-7xl mx-auto">
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
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none uppercase mb-4">
            <span className="text-white">
              {program.title.split(" ").slice(0, -1).join(" ")}
            </span>
            <br />
            <span className="text-neon">
              {program.title.split(" ").slice(-1)[0]}
            </span>
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

      {/* Program Overview — dark section */}
      <section className="bg-navy border-t-2 border-neon">
        {/* Curriculum marquee ticker */}
        <div className="bg-[#070b12] border-y border-white/[0.07] py-2.5 overflow-hidden">
          <div
            className="flex items-center whitespace-nowrap animate-marquee-left"
            style={{ animationDuration: "10s" }}
          >
            {[0, 1].map((dupe) => (
              <span key={dupe} className="flex items-center">
                {program.curriculum.map((subject) => (
                  <span key={subject} className="inline-flex items-center gap-3 px-7">
                    <span className="text-neon text-[8px] leading-none">●</span>
                    <span className="font-mono text-[13px] text-white/35 tracking-[0.14em] uppercase">
                      {subject}
                    </span>
                    <span className="text-white/15 text-xs font-light ml-1">|</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Section content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 md:px-16 py-16 md:py-24 max-w-7xl mx-auto"
        >
          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <span className="text-white/20 font-mono text-sm">01</span>
            <div className="h-px w-10 bg-neon/40" />
            <span className="text-neon text-[10px] font-extrabold tracking-[0.3em] uppercase">
              Program Overview
            </span>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: heading + text */}
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase mb-10">
                <span className="text-white">About the</span>
                <br />
                <span className="text-neon">Program</span>
              </h2>
              <div className="flex flex-col gap-5">
                {program.overviewParagraphs.map((para, i) => (
                  <p key={i} className="text-white/60 leading-relaxed text-base md:text-lg">
                    {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="text-white font-semibold">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: stats card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              {[
                { label: "Core Subjects", value: `${program.curriculum.length}+` },
                { label: "Career Pathways", value: String(program.careers.length) },
                { label: "Years of Study", value: String(parseInt(program.duration)) },
                { label: "Accreditation Body", value: program.accreditation },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`flex items-center justify-between px-8 py-6 ${
                    i < arr.length - 1 ? "border-b border-white/10" : ""
                  }`}
                >
                  <span className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase">
                    {stat.label}
                  </span>
                  <span className="text-neon font-black text-3xl md:text-4xl">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Remaining sections — off-white */}
      <div className="bg-off-white px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

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
