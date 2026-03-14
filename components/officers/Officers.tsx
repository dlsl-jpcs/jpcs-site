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
  {
    key: "Executive",
    label: "Executive Officers",
    short: "Executive",
    description: "Leading the organization",
  },
  {
    key: "Project Heads",
    label: "Project Heads",
    short: "Proj. Heads",
    description: "Driving our initiatives",
  },
  {
    key: "Officers",
    label: "Officers",
    short: "Officers",
    description: "Supporting our operations",
  },
  {
    key: "Reps",
    label: "Representatives",
    short: "Reps",
    description: "Representing our members",
  },
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

const CARD_W = 300;
const CARD_GAP = 24; // Increased gap for breathability
const STEP = CARD_W + CARD_GAP;

export default function Officers() {
  const [active, setActive] = useState<Category>("Executive");
  const [canScroll, setCanScroll] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [open, setOpen] = useState<Category | null>("Executive");
  const accordionRefs = useRef<Partial<Record<Category, HTMLDivElement>>>({});

  const toggleAccordion = (key: Category) => {
    const isCurrentlyOpen = open === key;
    setOpen(isCurrentlyOpen ? null : key);
    if (isCurrentlyOpen) {
      const el = accordionRefs.current[key];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
      const next = x.get() - dir * STEP * 2;
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
      className="relative py-20 min-[401px]:py-24 md:py-32 bg-charcoal overflow-hidden rounded-t-[3rem] -mt-10 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="px-4 min-[401px]:px-6 md:px-16 mb-12 min-[401px]:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8 min-[401px]:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl min-[401px]:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-white tracking-tight leading-tight">
              The <span className="text-neon inline-block">Officers</span>
            </h2>
            <p className="mt-3 min-[401px]:mt-4 text-white/50 text-base min-[401px]:text-lg max-w-md font-medium">
              The dedicated individuals driving JPCS DLSL forward through
              innovation and service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            {SECTIONS.map(({ key, short }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className="relative px-6 py-3 rounded-full text-sm font-extrabold transition-colors duration-300"
                >
                  {isActive && (
                    <motion.span
                      layoutId="officer-tab-pill"
                      className="absolute inset-0 rounded-full bg-neon"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-300 ${isActive ? "text-navy" : "text-white/50 hover:text-white"}`}
                  >
                    {short}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="hidden md:block relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-charcoal to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-charcoal to-transparent" />

          <div
            ref={containerRef}
            className={`overflow-hidden px-4 min-[401px]:px-6 md:px-16 ${!canScroll ? " flex justify-center" : ""}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  ref={trackRef}
                  drag="x"
                  dragConstraints={{ left: -maxScroll(), right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  className="flex cursor-grab active:cursor-grabbing pb-8 pt-4"
                  style={{ x, gap: CARD_GAP, width: "max-content" }}
                >
                  {officers.map((officer, idx) => (
                    <motion.div
                      key={officer.Name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
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

          {canScroll && (
            <div className="px-4 min-[401px]:px-6 md:px-16 mt-3 min-[401px]:mt-4 flex items-center justify-end gap-3 min-[401px]:gap-4">
              <button
                onClick={() => slide(-1)}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-neon hover:border-neon hover:text-navy transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => slide(1)}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-neon hover:border-neon hover:text-navy transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden px-4 min-[401px]:px-6 space-y-3 min-[401px]:space-y-4">
          {SECTIONS.map(({ key, label }, i) => {
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
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isOpen ? "border-neon/30 bg-white/5" : "border-white/10 bg-transparent"}`}
              >
                <button
                  onClick={() => toggleAccordion(key)}
                  className="w-full flex items-center justify-between p-5 min-[401px]:p-6 text-left"
                >
                  <span
                    className={`text-base min-[401px]:text-lg font-extrabold ${isOpen ? "text-neon" : "text-white"}`}
                  >
                    {label}
                  </span>
                  <div
                    className={`w-7 h-7 min-[401px]:w-8 min-[401px]:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-neon text-navy" : "bg-white/10 text-white"}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="p-5 min-[401px]:p-6 pt-0 flex overflow-x-auto gap-3 min-[401px]:gap-4 snap-x pb-4">
                        {sectionOfficers.map((officer) => (
                          <div
                            key={officer.Name}
                            className="snap-center shrink-0"
                          >
                            <OfficerCard
                              name={officer.Name}
                              nickname={officer.Nickname}
                              image={officer.Image}
                              position={officer.Position}
                              year={officer.Year}
                              course={officer.Course}
                            />
                          </div>
                        ))}
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
