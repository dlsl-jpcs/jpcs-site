// ProjectsEvents.tsx
"use client";
import { useState, useEffect } from "react";
import "swiper/css";
import ProjectsCarousel from "./events/ProjectsCarousel";
import { Project } from "@/types/projects";
import { motion } from "framer-motion";
import CircuitTraces from "./tech/CircuitTraces";
import GridSpotlight from "./tech/GridSpotlight";
import ScrambleText from "./tech/ScrambleText";
import SectionTag from "./tech/SectionTag";

export default function ProjectsEvents() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to load projects");
        const data = await response.json();
        setProjects(data.data ?? []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // /api/projects already includes each project's cover image.
  const displayProjects = projects.map((project) => ({
    ...project,
    gallery: project.gallery ?? [],
  }));

  return (
    // Bottom padding leaves room under the rail for the corner traces, clear of the cards.
    <section id="projects" className="relative bg-navy overflow-hidden pb-32 min-[401px]:pb-36">
      <CircuitTraces tone="dark" corners={["bl", "br"]} />
      <GridSpotlight />

      {/* Heading block in normal flow, so the carousel below never overlaps it. Behind it, the
          white crescent: an ellipse-bottomed shape wider than the screen (the section clips it),
          so its edges meet the navy on a slope instead of curling straight down. */}
      <div className="relative z-10 px-4 pt-20 pb-12 text-center min-[401px]:px-6 sm:pt-24 sm:pb-16 lg:pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 -inset-x-[8%] -z-10 overflow-hidden bg-[#F4F4F5] [--curve:6rem] sm:[--curve:10rem] lg:[--curve:15rem]"
          style={{ borderRadius: "0 0 50% 50% / 0 0 var(--curve) var(--curve)" }}
        >
          {/* Same colour and grid as the Programs section above, continuing its lines across the
              seam: Programs anchors its grid to its bottom edge, this one starts at its top edge,
              and the layer is inset back to the section's width (8 / 116) so columns line up too. */}
          <div className="absolute inset-y-0 left-[6.8966%] w-[86.2069%] bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto flex max-w-2xl flex-col items-center"
        >
          <SectionTag label="// 04 — projects" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6">
            Our{" "}
            <span className="bg-neon px-5 py-2 rounded-full inline-block transform rotate-2">
              <ScrambleText text="Projects" />
            </span>
          </h2>
          <p className="text-navy/60 text-lg md:text-xl font-medium">
            Discover opportunities to build, learn, and connect.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mt-10 w-full min-w-0 sm:mt-14"
      >
        {loading ? (
          // Same gutter and card widths as the rail in ProjectsCarousel, so nothing jumps on load.
          <div
            role="status"
            className="flex w-full gap-4 overflow-hidden px-[var(--gutter)] pt-[3.25rem] sm:gap-5 sm:pt-[4.25rem] [--gutter:1rem] sm:[--gutter:1.5rem] xl:[--gutter:calc((100vw-80rem)/2+1.5rem)]"
          >
            <span className="sr-only">Loading projects</span>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`h-[380px] w-[82%] shrink-0 animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.05] sm:h-[440px] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] ${i === 2 ? "hidden lg:block" : ""}`}
              />
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center px-6 py-16 text-center">
            <p className="font-bold text-white">Projects are on the way</p>
            <p className="mt-1 max-w-sm text-sm text-white/60">
              Photos and recaps from our activities will be posted here soon.
            </p>
          </div>
        ) : (
          <ProjectsCarousel projects={displayProjects} />
        )}
      </motion.div>
    </section>
  );
}
