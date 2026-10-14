// ProjectsEvents.tsx
"use client";
import { useState, useEffect } from "react";
import "swiper/css";
import ProjectsCarousel from "./events/ProjectsCarousel";
import { Project } from "@/types/projects";
import { motion } from "framer-motion";

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
    <section
      id="projects"
      className="relative min-h-[800px] bg-navy grid grid-rows-[1fr_2fr] overflow-hidden pb-24"
    >
      <div
        className="relative bg-white mt-[-200px] w-[100%] min-h-[160%] rounded-b-[50%] justify-self-center overflow-visible bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.09)),linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]
bg-[size:auto,4rem_4rem,4rem_4rem]"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[200px] sm:top-[150px] md:top-[180px] lg:top-[200px] left-1/2 -translate-x-1/2 text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6">
            Our{" "}
            <span className="bg-neon px-5 py-2 rounded-full inline-block transform rotate-2">
              Projects
            </span>
          </h2>
          <p className="text-navy/60 text-lg md:text-xl font-medium max-w-2xl">
            Discover opportunities to build, learn, and connect.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative h-full w-full min-w-0 mt-[-40px]"
      >
        {loading ? (
          <div role="status" className="flex h-full w-full items-start justify-center gap-6 overflow-hidden pt-6">
            <span className="sr-only">Loading projects</span>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`h-[300px] w-[78%] shrink-0 animate-pulse rounded-[18px] border border-white/10 bg-white/[0.05] sm:h-[400px] sm:w-[70%] sm:rounded-[24px] md:h-[460px] md:w-[52%] lg:h-[485px] lg:w-[38%] lg:rounded-[28px] xl:w-[34%] ${i === 1 ? "" : "hidden lg:block opacity-40"}`}
              />
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center px-6 text-center">
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
