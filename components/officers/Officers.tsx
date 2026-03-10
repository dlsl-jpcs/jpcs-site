"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import officersData from "@/data/officers.json";
import OfficerCard from "./OfficerCard";

type Category = "Executive" | "Project Heads" | "Officers" | "Reps";

const SECTIONS: {
  key: Category;
  label: string;
  short: string;
  description: string;
}[] = [
  { key: "Executive", label: "Executive Officers", short: "Executive", description: "Leading the organization" },
  { key: "Project Heads", label: "Project Heads", short: "Proj. Heads", description: "Driving our initiatives" },
  { key: "Officers", label: "Officers", short: "Officers", description: "Supporting our operations" },
  { key: "Reps", label: "Representatives", short: "Reps", description: "Representing our members" },
];

function getCategory(position: string): Category {
  if (
    /president|vice president|secretary|finance|auditor|p\.r\.o/i.test(position)
  )
    return "Executive";
  if (/project head/i.test(position)) return "Project Heads";
  if (/rep/i.test(position)) return "Reps";
  return "Officers";
}

const CARD_W = 180;
const CARD_GAP = 16;
const STEP = CARD_W + CARD_GAP;

export default function Officers() {
  // Desktop carousel state
  const [active, setActive] = useState<Category>("Executive");
  const [canScroll, setCanScroll] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [open, setOpen] = useState<Category>("Executive");

  const officers = officersData.officers.filter(
    (o) => getCategory(o.Position) === active,
  );

  useEffect(() => {
    animate(x, 0, { duration: 0.4, ease: [0.4, 0, 0.2, 1] });
  }, [active, x]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const totalWidth = officers.length * STEP - CARD_GAP;
    setCanScroll(totalWidth > container.clientWidth);
  }, [active, officers.length]);

  const maxScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const visible = track.parentElement?.clientWidth ?? 0;
    const total = officers.length * STEP - CARD_GAP;
    return Math.max(0, total - visible);
  }, [officers.length]);

  const slide = useCallback(
    (dir: 1 | -1) => {
      const next = x.get() - dir * STEP * 3;
      const clamped = Math.max(-maxScroll(), Math.min(0, next));
      animate(x, clamped, { duration: 0.45, ease: [0.4, 0, 0.2, 1] });
    },
    [x, maxScroll],
  );

  const handleDragEnd = () => {
    const clamped = Math.max(-maxScroll(), Math.min(0, x.get()));
    if (clamped !== x.get()) {
      animate(x, clamped, { duration: 0.3, ease: [0.4, 0, 0.2, 1] });
    }
  };

  return (
    <section
      id="officers"
      className="relative py-20 md:py-32 bg-background overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(13,204,88,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(13,204,88,0.25), transparent)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white"
            style={{ left: `${(i + 1) * (100 / 7)}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="px-6 md:px-16 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 text-light-green text-[11px] font-bold tracking-[0.18em] uppercase border border-light-green/25 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-light-green animate-pulse" />
              The Team
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.05] tracking-tight">
                Meet our{" "}
                <span
                  className="text-light-green"
                  style={{ textShadow: "0 0 40px rgba(13,204,88,0.35)" }}
                >
                  Officers
                </span>
              </h2>
              <p className="mt-3 text-white/35 text-sm md:text-base max-w-md leading-relaxed">
                The dedicated individuals who lead and drive JPCS DLSL forward.
              </p>
            </motion.div>

            {/* Category tabs — desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="hidden md:flex items-center gap-1.5 p-1 rounded-xl border border-white/[0.07] bg-white/[0.02] self-start md:self-auto flex-wrap"
            >
              {SECTIONS.map(({ key, short }) => {
                const isActive = active === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className="relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="tab-pill"
                        className="absolute inset-0 rounded-lg bg-light-green/[0.12] border border-light-green/20"
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      />
                    )}
                    <span
                      className={`relative flex items-center gap-1.5 transition-colors duration-200 ${
                        isActive
                          ? "text-light-green"
                          : "text-white/35 hover:text-white/55"
                      }`}
                    >
                      {short}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div className="hidden md:block relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, var(--background, #080808), transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, var(--background, #080808), transparent)",
            }}
          />

          <div ref={containerRef} className={`overflow-hidden px-6 md:px-16${!canScroll ? " flex justify-center" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  ref={trackRef}
                  drag="x"
                  dragConstraints={{ left: -maxScroll(), right: 0 }}
                  dragElastic={0.08}
                  onDragEnd={handleDragEnd}
                  className="flex cursor-grab active:cursor-grabbing"
                  style={{ x, gap: CARD_GAP, width: "max-content" }}
                >
                  {officers.map((officer, idx) => (
                    <motion.div
                      key={officer.Name}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.35,
                        delay: idx * 0.04,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      style={{ width: CARD_W }}
                      className="flex-shrink-0"
                    >
                      <OfficerCard
                        name={officer.Name}
                        nickname={officer.Nickname}
                        image={officer.Image}
                        position={officer.Position}
                        year={officer.Year}
                        course={officer.Course}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-6 md:px-16 mt-8 flex items-center justify-end">

            {canScroll && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => slide(-1)}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200 active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M8.5 3L5 7l3.5 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => slide(1)}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200 active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5.5 3L9 7l-3.5 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile: Accordion ── */}
        <div className="md:hidden px-6 space-y-2">
          {SECTIONS.map(({ key, label, description }, i) => {
            const sectionOfficers = officersData.officers.filter(
              (o) => getCategory(o.Position) === key,
            );
            if (sectionOfficers.length === 0) return null;
            const isOpen = open === key;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-2xl border transition-colors duration-300 ${
                  isOpen
                    ? "border-light-green/20 bg-white/[0.02]"
                    : "border-white/[0.06]"
                }`}
              >
                <button
                  onClick={() => setOpen(key)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums transition-all duration-200 ${
                      isOpen
                        ? "bg-light-green text-background"
                        : "bg-white/[0.05] text-white/25"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold leading-none transition-colors duration-200 ${
                        isOpen ? "text-white" : "text-white/50"
                      }`}
                    >
                      {label}
                    </p>
                    <p
                      className={`mt-1.5 text-xs transition-colors duration-200 ${
                        isOpen ? "text-white/35" : "text-white/20"
                      }`}
                    >
                      {description}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[11px] font-semibold tabular-nums px-2.5 py-1 rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "text-light-green border-light-green/30 bg-light-green/[0.08]"
                        : "text-white/25 border-white/[0.08]"
                    }`}
                  >
                    {sectionOfficers.length}
                  </span>

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-light-green" : "text-white/20"
                    }`}
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="mx-5 h-px bg-white/[0.06]" />
                      <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {sectionOfficers.map((officer, idx) => (
                            <motion.div
                              key={officer.Name}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, delay: idx * 0.025 }}
                            >
                              <OfficerCard
                                name={officer.Name}
                                nickname={officer.Nickname}
                                image={officer.Image}
                                position={officer.Position}
                                year={officer.Year}
                                course={officer.Course}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
