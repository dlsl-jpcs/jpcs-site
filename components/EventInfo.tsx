"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Project } from "@/types/projects";
import DetailsModal, { socialLinkClass } from "./DetailsModal";

interface Props {
  project: Project | null;
  onClose: () => void;
}

/** Project details: description, org, date, links and up to 4 more photos (the cover stays on the card). */
function EventInfo({ project, onClose }: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const [active, setActive] = useState(0);

  if (!project) return null;

  const gallery = (project.gallery ?? []).slice(0, 4);
  const current = gallery[active] ?? gallery[0];

  return (
    <DetailsModal
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      closeLabel="Close project details"
    >
      {gallery.length > 0 && (
        <div className="bg-[#0D1522]">
          <div className="relative aspect-[16/10] w-full sm:aspect-video">
            <Image
              key={current}
              src={current}
              alt={`${project.name} photo ${active + 1} of ${gallery.length}`}
              fill
              sizes="(min-width: 700px) 650px, 95vw"
              className="object-contain"
              priority
            />
          </div>
          {gallery.length > 1 && (
            <ul className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 sm:px-5">
              {gallery.map((src, i) => (
                <li key={src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1} of ${gallery.length}`}
                    aria-current={i === active}
                    className={`relative block h-14 w-20 overflow-hidden rounded-lg ring-2 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon sm:h-16 sm:w-24 ${
                      i === active
                        ? "ring-neon"
                        : "ring-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className={`min-w-0 ${gallery.length === 0 ? "pr-12" : ""}`}>
            <h3
              id={titleId}
              className="break-words text-xl font-bold leading-tight sm:text-2xl"
            >
              {project.name}
            </h3>
            {project.org && (
              <p className="mt-1 text-sm font-medium text-gray-400">
                {project.org}
              </p>
            )}
          </div>
          {project.date && (
            <p className="w-fit shrink-0 rounded-xl bg-[#6B728026] px-3 py-1.5 text-sm font-medium text-gray-200">
              {project.date}
            </p>
          )}
        </div>

        <p
          id={descriptionId}
          className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-300 sm:text-base"
        >
          {project.description}
        </p>

        {(project.facebook || project.instagram) && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {project.facebook && (
              <a
                href={project.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
              >
                Facebook
                <span className="sr-only"> (opens in new window)</span>
              </a>
            )}
            {project.instagram && (
              <a
                href={project.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
              >
                Instagram
                <span className="sr-only"> (opens in new window)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </DetailsModal>
  );
}

export default EventInfo;
