"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, useReducedMotion } from "framer-motion";

import { Project } from "@/types/projects";
import EventInfo from "../EventInfo";
import { useBorderBeam } from "../tech/hooks";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ProjectsCarouselProps {
  projects: Project[];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Projects as a native scroll-snap rail. The browser does the scrolling (trackpad and touch
 * swipe for free), only on-screen cards paint, and nothing is rotated or blurred, so it stays
 * smooth on weak laptops. The rail bleeds to the screen edges but its first card lines up with
 * the page's 80rem content column.
 */
export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const beamRef = useBorderBeam<HTMLDivElement>();
  const reduce = useReducedMotion();

  const [first, setFirst] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Distance between card starts (card width + gap).
  const step = useCallback(() => {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || "0");
  }, []);

  // Scroll position → counter and button states. State only changes when a value
  // actually changes, so a scroll gesture costs a couple of renders, not one per frame.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const s = step();
      const atEnd = rail.scrollLeft >= max - 4;
      // The counter tracks the leftmost card, but at the end several are visible at once, so
      // show the last one there (11 / 11, not 09 / 11).
      setFirst(atEnd ? projects.length - 1 : s ? Math.min(projects.length - 1, Math.round(rail.scrollLeft / s)) : 0);
      setCanPrev(rail.scrollLeft > 4);
      setCanNext(!atEnd);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [projects.length, step]);

  const scrollByCards = (dir: 1 | -1, page = false) => {
    const rail = railRef.current;
    const s = step();
    if (!rail || !s) return;
    // A page is however many whole cards fit; the snap points tidy up the landing.
    const cards = page ? Math.max(1, Math.floor((rail.clientWidth + 1) / s)) : 1;
    rail.scrollBy({ left: dir * cards * s, behavior: reduce ? "auto" : "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectedProject) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards(e.key === "ArrowLeft" ? -1 : 1);
    }
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  const navButton =
    "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-200 hover:border-neon/60 hover:text-neon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white";

  return (
    <>
      <div
        ref={beamRef}
        className="w-full [--gutter:1rem] sm:[--gutter:1.5rem] xl:[--gutter:calc((100vw-80rem)/2+1.5rem)]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        onKeyDown={handleKeyDown}
      >
        {/* Header: terminal prompt on the left, counter and arrows on the right. */}
        <div className="mb-4 flex items-center justify-between gap-4 px-[var(--gutter)] sm:mb-6">
          <p className="font-mono text-xs text-white/50 sm:text-sm">
            <span className="text-neon">$</span> ls -t ./projects{" "}
            <span className="hidden text-white/30 sm:inline">· {projects.length} items</span>
          </p>

          <div className="flex items-center gap-2 sm:gap-3">
            <p aria-live="polite" className="min-w-[64px] text-center font-mono text-xs tabular-nums text-white sm:text-sm">
              {pad(first + 1)}
              <span className="text-white/40"> / {pad(projects.length)}</span>
            </p>
            <button type="button" onClick={() => scrollByCards(-1, true)} disabled={!canPrev} aria-label="Previous projects" className={navButton}>
              <NavigateBeforeIcon fontSize="small" />
            </button>
            <button type="button" onClick={() => scrollByCards(1, true)} disabled={!canNext} aria-label="Next projects" className={navButton}>
              <NavigateNextIcon fontSize="small" />
            </button>
          </div>
        </div>

        <ul
          ref={railRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[var(--gutter)] pt-2 pb-6 [scroll-padding-inline:var(--gutter)] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, index) => (
            <li
              key={project.id}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${projects.length}`}
              className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <article className="border-beam group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0D1522] text-white transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-neon/40">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-light">
                  <Image
                    src={project.image || "/jpcslogo.png"}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 32vw"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-navy/90 px-2 py-0.5 font-mono text-[11px] font-medium text-neon">
                    #{pad(index + 1)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {project.date && <p className="mb-2 font-mono text-[11px] text-white/45 sm:text-xs">{project.date}</p>}
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug sm:text-xl">{project.name}</h3>
                  <p className="mb-5 line-clamp-3 text-[13px] font-medium leading-relaxed text-[#9CA3AF] sm:text-sm">
                    {project.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    aria-haspopup="dialog"
                    aria-label={`More info about ${project.name}`}
                    // The ::after covers the whole card so any part of it opens the details.
                    className="mt-auto flex items-center gap-3 self-start rounded-full text-[#9CA3AF] outline-none transition-colors duration-200 group-hover:text-white after:absolute after:inset-0 after:z-10 after:rounded-[1.5rem] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-neon"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current transition-colors duration-200 group-hover:border-neon group-hover:bg-neon group-hover:text-navy">
                      <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </span>
                    <span className="font-mono text-xs tracking-wide">more_info()</span>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {selectedProject && <EventInfo project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
}
