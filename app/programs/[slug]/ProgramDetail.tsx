"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import type { Program } from "@/data/programs";

export default function ProgramDetail({ program }: { program: Program }) {
  const [openCareer, setOpenCareer] = useState<number | null>(null);
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
                { label: "Career Pathways", value: String(program.careers.length) + "+" },
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

      {/* Core Curriculum */}
      <section className="bg-off-white h-screen flex flex-col justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 md:px-16 py-10 md:py-14 max-w-7xl mx-auto w-full"
        >
          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-navy/20 font-mono text-sm">02</span>
            <div className="h-px w-10 bg-navy/20" />
            <span className="text-navy text-[10px] font-extrabold tracking-[0.3em] uppercase">
              Core Curriculum
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start">
            {/* Left: heading + description */}
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase mb-8">
                <span className="text-navy">What You</span>
                <br />
                <span className="bg-neon text-navy px-5 py-2 rounded-full inline-block transform -rotate-2">Study</span>
              </h2>
              <p className="text-navy/50 leading-relaxed text-base">
                A rigorous blend of theory and applied practice. Every course is engineered to build on the last, creating a foundation that scales from first principles to industry-grade systems.
              </p>
            </div>

            {/* Right: subjects card — white card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-2">
                {program.curriculum.map((subject, i) => {
                  const isLastRow = Math.floor(i / 2) >= Math.floor((program.curriculum.length - 1) / 2);
                  const isLeftCol = i % 2 === 0;
                  return (
                    <div
                      key={subject}
                      className={`group flex items-center px-6 py-4 gap-4 transition-colors duration-200 hover:bg-neon/5 ${
                        isLeftCol ? "border-r border-gray-200" : ""
                      } ${!isLastRow ? "border-b border-gray-200" : ""}`}
                    >
                      <span className="font-mono text-xs flex-shrink-0 text-navy/30 group-hover:text-neon group-hover:font-bold transition-colors duration-200">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs truncate text-navy/70 group-hover:text-navy transition-colors duration-200">
                        {subject}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Career Paths */}
      <section className="bg-navy min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 md:px-16 py-10 md:py-14 max-w-7xl mx-auto w-full"
        >
          {/* Section label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-white/20 font-mono text-sm">03</span>
            <div className="h-px w-10 bg-neon/40" />
            <span className="text-neon text-[10px] font-extrabold tracking-[0.3em] uppercase">
              Career Paths
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase mb-8">
            <span className="text-white">Where You'll</span>
            <br />
            <span className="text-neon">Go</span>
          </h2>

          {/* Career list */}
          <div className="flex flex-col">
            {program.careers.map((career, i) => {
              const isOpen = openCareer === i;
              return (
                <div
                  key={career.name}
                  className="border-b border-white/[0.08] first:border-t first:border-white/[0.08]"
                >
                  {/* Row header */}
                  <div
                    className="flex items-center justify-between py-3 px-2 -mx-2 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02]"
                    onClick={() => setOpenCareer(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`font-mono text-xs w-6 flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-neon" : "text-white/20"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`font-extrabold text-xs md:text-sm uppercase tracking-wide transition-colors duration-200 ${isOpen ? "text-neon" : "text-white"}`}>
                        {career.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="border border-neon/40 text-neon font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-sm">
                        {career.tag}
                      </span>
                      <div className={`w-7 h-7 border rounded flex-shrink-0 transition-colors duration-200 ${isOpen ? "border-neon text-neon" : "border-white/20 text-white/30"}`}>
                        <svg viewBox="0 0 28 28" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          {isOpen ? (
                            <>
                              <line x1="11" y1="11" x2="17" y2="17" />
                              <line x1="17" y1="11" x2="11" y2="17" />
                            </>
                          ) : (
                            <>
                              <line x1="14" y1="10" x2="14" y2="18" />
                              <line x1="10" y1="14" x2="18" y2="14" />
                            </>
                          )}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Accordion body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open:      { height: "auto", opacity: 1 },
                          collapsed: { height: 0,      opacity: 0 },
                        }}
                        transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="pb-4 px-2 -mx-2 pl-14">
                          <p className="text-white/50 text-sm leading-relaxed mb-3">
                            {career.desc}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {career.subTags.map((sub) => (
                              <span
                                key={sub}
                                className="border border-white/15 text-white/40 text-[10px] font-mono tracking-wide uppercase px-3 py-1 rounded-sm"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Why Choose */}
      <div className="bg-off-white px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-charcoal rounded-3xl p-8 border border-white/5"
          >
            <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
              Why Choose {program.short}?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  );
}
