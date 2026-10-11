"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { Project } from "@/types/projects";
import { useModalA11y } from "@/lib/useModalA11y";

interface Props {
  project: Project | null;
  onClose: () => void;
}

const socialLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-neon/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon";

function EventInfo({ project, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalA11y(mounted, dialogRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted || !project) return null;

  const hasImage = Boolean(project.image);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 sm:p-6"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[650px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D172F] text-white shadow-2xl outline-none sm:max-h-[min(90dvh,720px)]"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] w-full shrink-0 bg-[#0D1522] sm:aspect-video">
          <Image
            src={hasImage ? project.image : "/jpcslogo.png"}
            alt={hasImage ? project.name : "JPCS logo"}
            fill
            sizes="(min-width: 700px) 650px, 95vw"
            className={hasImage ? "object-cover" : "object-contain p-10"}
            priority
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0D172F] to-transparent" />

          <button
            type="button"
            onClick={onClose}
            data-autofocus
            aria-label="Close project details"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#27334C] text-white transition-colors hover:bg-[#33415f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon sm:right-4 sm:top-4"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Details */}
        <div className="flex min-h-0 flex-1 flex-col px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
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

          <div
            id={descriptionId}
            tabIndex={0}
            className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 text-sm leading-relaxed text-gray-300 whitespace-pre-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon sm:text-base"
          >
            {project.description}
          </div>

          {(project.facebook || project.instagram) && (
            <div className="mt-4 flex shrink-0 flex-wrap gap-2 border-t border-white/10 pt-4">
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
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default EventInfo;
