"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import type { Program } from "@/data/programs";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

function Reveal({
  children,
  className,
  variants = stagger,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: typeof stagger;
  amount?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount });
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealItem({
  children,
  className,
  duration = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProgramDetail({ program }: { program: Program }) {
  const [openCareer, setOpenCareer] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-charcoal">
      {/* ── Hero ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-navy to-charcoal pt-28 pb-16 md:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute -bottom-4 -right-8 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter" aria-hidden="true">
          {program.short}
        </div>

        <div className="relative z-10 w-full px-6 md:px-16 max-w-7xl mx-auto">
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
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none uppercase mb-4">
            <span className="text-white">
              {program.title.split(" ").slice(0, -1).join(" ")}
            </span>
            <br />
            <span className="text-neon">
              {program.title.split(" ").slice(-1)[0]}
            </span>
          </h1>
          <p className="text-white/60 text-base md:text-xl mb-10 max-w-2xl leading-relaxed">
            {program.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Duration", value: program.duration },
              { label: "Award", value: program.degree },
              { label: "Accreditation", value: program.accreditation },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl px-4 md:px-6 py-3 text-center"
              >
                <div className="text-neon font-extrabold text-base md:text-lg">{stat.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Program Overview ── */}
      <section className="bg-navy border-t-2 border-neon">
        {/* Ticker */}
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

        <div className="px-6 md:px-16 py-14 md:py-24 max-w-7xl mx-auto">
          <Reveal>
            <RevealItem duration={0.45}>
              <div className="flex items-center gap-4 mb-10 md:mb-12">
                <span className="text-white/20 font-mono text-sm">01</span>
                <div className="h-px w-10 bg-neon/40" />
                <span className="text-neon text-[10px] font-extrabold tracking-[0.3em] uppercase">
                  Program Overview
                </span>
              </div>
            </RevealItem>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
              {/* Left */}
              <div>
                <RevealItem duration={0.6}>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase mb-8">
                    <span className="text-white">About the</span>
                    <br />
                    <span className="text-neon">Program</span>
                  </h2>
                </RevealItem>
                {program.overviewParagraphs.map((para, i) => (
                  <RevealItem key={i} duration={0.5}>
                    <p className="text-white/60 leading-relaxed text-sm md:text-lg mb-5">
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
                  </RevealItem>
                ))}
              </div>

              {/* Right: stats */}
              <Reveal variants={staggerFast} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                {[
                  { label: "Core Subjects", value: `${program.curriculum.length}+` },
                  { label: "Career Pathways", value: `${program.careers.length}+` },
                  { label: "Years of Study", value: String(parseInt(program.duration)) },
                  { label: "Accreditation Body", value: program.accreditation },
                ].map((stat, i, arr) => (
                  <RevealItem key={stat.label} duration={0.4}>
                    <div className={`flex items-center justify-between px-5 md:px-8 py-4 md:py-6 ${i < arr.length - 1 ? "border-b border-white/10" : ""}`}>
                      <span className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase">
                        {stat.label}
                      </span>
                      <span className="text-neon font-black text-2xl md:text-4xl">
                        {stat.value}
                      </span>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Core Curriculum ── */}
      <section className="bg-off-white min-h-screen flex flex-col justify-center py-16 md:py-0 md:h-screen md:overflow-hidden">
        <Reveal className="px-6 md:px-16 py-0 md:py-14 max-w-7xl mx-auto w-full">
          <RevealItem duration={0.45}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-navy/20 font-mono text-sm">02</span>
              <div className="h-px w-10 bg-navy/20" />
              <span className="text-navy text-[10px] font-extrabold tracking-[0.3em] uppercase">
                Core Curriculum
              </span>
            </div>
          </RevealItem>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-16 items-start">
            <div>
              <RevealItem duration={0.6}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase mb-6 md:mb-8">
                  <span className="text-navy">What You</span>
                  <br />
                  <span className="bg-neon text-navy px-4 md:px-5 py-2 rounded-full inline-block transform -rotate-2">Study</span>
                </h2>
              </RevealItem>
              <RevealItem duration={0.5}>
                <p className="text-navy/50 leading-relaxed text-sm md:text-base">
                  A rigorous blend of theory and applied practice. Every course is engineered to build on the last, creating a foundation that scales from first principles to industry-grade systems.
                </p>
              </RevealItem>
            </div>

            <RevealItem duration={0.6}>
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-2">
                  {program.curriculum.map((subject, i) => {
                    const isLastRow = Math.floor(i / 2) >= Math.floor((program.curriculum.length - 1) / 2);
                    const isLeftCol = i % 2 === 0;
                    return (
                      <div
                        key={subject}
                        className={`group flex items-center px-3 md:px-6 py-3 md:py-4 gap-2 md:gap-4 transition-colors duration-200 hover:bg-neon/5 ${isLeftCol ? "border-r border-gray-200" : ""} ${!isLastRow ? "border-b border-gray-200" : ""}`}
                      >
                        <span className="font-mono text-[10px] md:text-xs flex-shrink-0 text-navy/30 group-hover:text-neon group-hover:font-bold transition-colors duration-200">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] md:text-xs truncate text-navy/70 group-hover:text-navy transition-colors duration-200">
                          {subject}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </RevealItem>
          </div>
        </Reveal>
      </section>

      {/* ── Career Paths ── */}
      <section className="bg-navy min-h-screen flex flex-col justify-center py-16 md:py-0">
        <Reveal className="px-6 md:px-16 py-0 md:py-14 max-w-7xl mx-auto w-full">
          <RevealItem duration={0.45}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white/20 font-mono text-sm">03</span>
              <div className="h-px w-10 bg-neon/40" />
              <span className="text-neon text-[10px] font-extrabold tracking-[0.3em] uppercase">
                Career Paths
              </span>
            </div>
          </RevealItem>

          <RevealItem duration={0.6}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase mb-8">
              <span className="text-white">Where You'll</span>
              <br />
              <span className="text-neon">Go</span>
            </h2>
          </RevealItem>

          <Reveal variants={staggerFast} className="flex flex-col">
            {program.careers.map((career, i) => {
              const isOpen = openCareer === i;
              return (
                <RevealItem key={career.name} duration={0.4}>
                  <div className="border-b border-white/[0.08] first:border-t first:border-white/[0.08]">
                    <div
                      className="flex items-center justify-between py-3 px-2 -mx-2 cursor-pointer transition-colors duration-200 hover:bg-white/[0.02]"
                      onClick={() => setOpenCareer(isOpen ? null : i)}
                    >
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        <span className={`font-mono text-xs w-6 flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-neon" : "text-white/20"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`font-extrabold text-xs md:text-sm uppercase tracking-wide transition-colors duration-200 truncate ${isOpen ? "text-neon" : "text-white"}`}>
                          {career.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-3">
                        <span className="hidden sm:inline-flex border border-neon/40 text-neon font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-sm">
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
                          <div className="pb-4 px-2 -mx-2 pl-8 md:pl-14">
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
                </RevealItem>
              );
            })}
          </Reveal>
        </Reveal>
      </section>

      {/* ── Why Choose ── */}
      <div className="relative z-40 bg-off-white min-h-screen md:h-[calc(100vh+2.5rem)] flex flex-col justify-center md:overflow-hidden py-16 md:py-0 pb-20 md:pb-14">
        <Reveal className="px-6 md:px-16 py-0 md:py-14 max-w-7xl mx-auto w-full">
          <RevealItem duration={0.45}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-navy/20 font-mono text-sm">04</span>
              <div className="h-px w-10 bg-navy/20" />
              <span className="text-navy text-[10px] font-extrabold tracking-[0.3em] uppercase">
                Why {program.short}
              </span>
            </div>
          </RevealItem>

          <RevealItem duration={0.6}>
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-12 mb-10 md:mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none uppercase shrink-0">
                <span className="text-navy">The Case For</span>
                <br />
                <span className="bg-neon text-navy px-4 md:px-5 py-2 rounded-full inline-block transform -rotate-2 mt-3">
                  Choosing {program.short}
                </span>
              </h2>
              <p className="text-navy/50 text-sm md:text-base leading-relaxed max-w-xs">
                Four reasons this program stands apart — from how it's built to where it takes you.
              </p>
            </div>
          </RevealItem>

          <Reveal variants={staggerFast} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {program.highlights.map((h, i) => (
              <RevealItem key={h.title} duration={0.4}>
                <div className="bg-white border-0 border-t-2 border-t-transparent rounded-2xl p-6 md:p-8 shadow-none transition-all duration-300 ease-in-out hover:border-t-neon hover:bg-gray-100 hover:shadow-xl">
                  <p className="text-gray-400 font-mono text-xs mb-4">
                    — {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-navy font-black text-lg md:text-xl uppercase tracking-wide mb-3">{h.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </Reveal>
      </div>
    </div>
  );
}
