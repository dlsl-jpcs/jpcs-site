"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { Project } from "@/types/projects";
import EventInfo from "../EventInfo";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ProjectsCarouselProps {
  projects: Project[];
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = () => {
      setIsMobile(mql.matches);
    };

    update();

    mql.addEventListener("change", update);

    return () => {
      mql.removeEventListener("change", update);
    };
  }, [breakpoint]);

  return isMobile;
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const isMobile = useIsMobile();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    containScroll: false,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  /*
   * ==========================
   * CAROUSEL CONTROLS
   * ==========================
   */

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  /*
   * ==========================
   * MODAL
   * ==========================
   */

  const openProjectInfo = (project: Project) => {
    setSelectedProject(project);
    setShowPopup(true);
  };

  const closeProjectInfo = () => {
    setShowPopup(false);
    setSelectedProject(null);
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  /*
   * ==========================
   * FAN EFFECT
   * ==========================
   *
   * Desktop:
   * Stronger fan effect.
   *
   * Mobile:
   * Almost no fan effect so cards
   * don't get clipped.
   */

  const MAX_FAN = isMobile ? 0 : 4;

  const ROTATE_STEP = isMobile ? 0 : -6;

  const TRANSLATE_Y_STEP = isMobile ? 0 : 26;

  const SCALE_STEP = isMobile ? 0.02 : 0.07;

  const OPACITY_STEP = isMobile ? 0.15 : 0.18;

  return (
    <>
      {/* =====================================================
          CAROUSEL
      ====================================================== */}

      <div className="w-full overflow-hidden">
        {/* Embla viewport */}

        <div
          ref={emblaRef}
          className="
            w-full
            overflow-hidden
            sm:overflow-visible
          "
        >
          {/* Embla container */}

          <div
            className="
              flex
              items-center
            "
          >
            {projects.map((project, index) => {
              const isActive = index === selectedIndex;

              const diff = index - selectedIndex;

              const clampedDiff = Math.max(-MAX_FAN, Math.min(MAX_FAN, diff));

              const rotation = clampedDiff * ROTATE_STEP;

              const translateY = Math.abs(clampedDiff) * TRANSLATE_Y_STEP;

              const scale = 1 - Math.abs(clampedDiff) * SCALE_STEP;

              const opacity = 1 - Math.abs(clampedDiff) * OPACITY_STEP;

              return (
                <div
                  key={project.id}
                  className="
                    relative
                    shrink-0
                    grow-0
                    w-[50px]

                    basis-[78%]
                    px-2

                    sm:basis-[70%]
                    sm:px-0
                    md:basis-[52%]
                    lg:basis-[38%]
                    xl:basis-[34%]
                  "
                >
                  {/* ==========================
                      CARD
                  =========================== */}

                  <div
                    className="
                      card
                      relative

                      mx-0

                      h-[300px]
                      
                      sm:mx-[-10px]
                      sm:h-[400px]

                      md:h-[460px]

                      lg:h-[485px]

                      rounded-[18px]

                      sm:rounded-[24px]

                      lg:rounded-[28px]

                      overflow-hidden

                      bg-[#0D1522]

                      text-white

                      transition-all
                      duration-500
                      ease-out
                    "
                    style={{
                      transform: `
                        rotate(${rotation}deg)
                        translateY(${translateY}px)
                        scale(${scale})
                      `,

                      opacity: Math.max(opacity, isMobile ? 0.4 : 0.25),

                      zIndex: 20 - Math.abs(clampedDiff),

                      border: isActive
                        ? "1.5px solid #D0FF47"
                        : "1px solid rgba(156,163,175,0.25)",

                      boxShadow: isActive
                        ? "0 0 30px rgba(208,255,71,0.20)"
                        : "none",
                    }}
                  >
                    {/* ==========================
                        IMAGE
                    =========================== */}

                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 78vw, (max-width: 768px) 70vw, (max-width: 1024px) 52vw, (max-width: 1280px) 38vw, 34vw"
                      priority={index === 0}
                    />

                    {/* ==========================
                        IMAGE GRADIENT
                    =========================== */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        top-0

                        h-[65%]

                        bg-gradient-to-b
                        from-transparent
                        via-transparent
                        to-[#0D1522]
                      "
                    />

                    {/* ==========================
                        DARK CONTENT BACKGROUND
                    =========================== */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0

                        h-[35%]

                        bg-[#0D1522]
                      "
                    />

                    {/* ==========================
                        CONTENT
                    =========================== */}

                    <div
                      className="
                        relative
                        z-10

                        flex
                        h-full
                        flex-col
                        justify-end
                      "
                    >
                      {/* Project information */}

                      <div
                        className="
                          px-4
                          pb-1

                          sm:px-6
                          sm:pb-3

                          lg:px-7
                        "
                      >
                        <h3
                          className="
                            mb-1

                            text-lg
                            font-semibold

                            sm:mb-2
                            sm:text-2xl

                            lg:text-2xl
                          "
                        >
                          {project.name}
                        </h3>

                        <p
                          className="
                            line-clamp-3

                            text-xs
                            font-medium
                            leading-relaxed

                            text-[#9CA3AF]

                            sm:line-clamp-4
                            sm:text-base
                          "
                        >
                          {project.description}
                        </p>
                      </div>

                      {/* ==========================
                          MORE INFO
                      =========================== */}

                      <div
                        className="
                          flex
                          h-[60px]
                          items-center

                          px-4

                          sm:h-[72px]
                          sm:px-6

                          lg:px-7
                        "
                      >
                        {isActive && (
                          <button
                            type="button"
                            onClick={() => openProjectInfo(project)}
                            className="
                              group
                              flex
                              items-center

                              text-[#9CA3AF]

                              transition-colors
                              duration-200

                              hover:text-white
                            "
                          >
                            {/* Arrow */}

                            <div
                              className="
                                mr-3

                                flex
                                h-[32px]
                                w-[32px]

                                items-center
                                justify-center

                                rounded-full

                                border
                                border-[#9CA3AF]

                                transition-all
                                duration-200

                                group-hover:border-white
                                group-hover:bg-white/5

                                sm:mr-5
                                sm:h-[38px]
                                sm:w-[38px]
                              "
                            >
                              <ArrowForwardIcon
                                fontSize={isMobile ? "small" : "small"}
                              />
                            </div>

                            <span
                              className="
                                text-[10px]
                                font-medium
                                tracking-wide

                                sm:text-sm
                              "
                            >
                              MORE INFO
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div
          className="
            mt-4

            flex
            items-center
            justify-center
            gap-1

            sm:mt-6
            sm:gap-2
          "
        >
          {/* Previous */}

          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous project"
            className="
              rounded-full

              transition-opacity
              duration-200

              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <NavigateBeforeIcon
              fontSize={isMobile ? "small" : "medium"}
              className="
                rounded-full
                bg-[#27334C]
                p-0.5
              "
            />
          </button>

          {/* Current slide */}

          <p
            className="
              mx-2
              min-w-[24px]

              text-center
              text-xs
              font-medium
              text-white

              sm:mx-3
              sm:text-base
            "
          >
            {String(selectedIndex + 1).padStart(2, "0")}
          </p>

          {/* Next */}

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next project"
            className="
              rounded-full

              transition-opacity
              duration-200

              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <NavigateNextIcon
              fontSize={isMobile ? "small" : "medium"}
              className="
                rounded-full
                bg-[#27334C]
                p-0.5
              "
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {showPopup && selectedProject && (
        <EventInfo project={selectedProject} onClose={closeProjectInfo} />
      )}
    </>
  );
}
