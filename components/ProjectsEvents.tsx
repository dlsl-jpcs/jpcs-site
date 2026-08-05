// ProjectsEvents.tsx
"use client";
import { useState, useEffect } from "react";
import "swiper/css";
import ProjectsCarousel from "./events/ProjectsCarousel";
import { Project } from "@/types/projects";
import { EventImage } from "@/types/eventsImages";

export default function ProjectsEvents() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<EventImage[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data.data ?? []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    const fetchImages = async () => {
      try {
        const response = await fetch("/api/eventImagesMain");
        const data = await response.json();
        setImage(data.data ?? []);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const displayProjects = projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    org: project.org,
    date: project.date,
    facebook: project.facebook,
    instagram: project.instagram,
    image:
      image.find((img) => img.projects_and_events_id === project.id)
        ?.image_url || "",
  }));

  return (
    <section
      id="projects"
      className="relative min-h-[800px] bg-navy grid grid-rows-[1fr_2fr] overflow-hidden"
    >
      <div
        className="relative bg-white mt-[-200px] w-[100%] min-h-[160%] rounded-b-[50%] justify-self-center overflow-visible bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.09)),linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]
bg-[size:auto,4rem_4rem,4rem_4rem]"
      >
        <div className="absolute top-[200px] sm:top-[150px] md:top-[180px] lg:top-[200px] left-1/2 -translate-x-1/2 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6">
            Our{" "}
            <span className="bg-neon px-5 py-2 rounded-full inline-block transform rotate-2">
              Projects
            </span>
          </h2>
          <p className="text-navy/60 text-lg md:text-xl font-medium max-w-2xl">
            Discover opportunities to build, learn, and connect.
          </p>
        </div>
      </div>

      <div className="relative h-full w-full mt-[-40px]">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center text-white/60">
            Loading projects...
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-white/60">
            No projects to show right now.
          </div>
        ) : (
          <ProjectsCarousel projects={displayProjects} />
        )}
      </div>
    </section>
  );
}
