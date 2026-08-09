"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface GalleryModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: GalleryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset expanded state whenever the modal closes
  useEffect(() => {
    if (!isOpen) setIsExpanded(false);
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isExpanded, onClose, onNext, onPrev]);

  if (!mounted || !images.length) return null;

  const currentImage = images[currentIndex];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="
            fixed inset-0
            z-[9999]
            flex items-center justify-center
            bg-black/70
            p-4 sm:p-8
          "
        >
          {/* Prev button */}
          {!isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="
                hidden sm:flex
                absolute left-4 md:left-10
                items-center justify-center
                w-10 h-10
                rounded-full
                bg-white/10 hover:bg-white/20
                text-white
                transition-colors
                z-10
              "
              aria-label="Previous image"
            >
              <NavigateBeforeIcon />
            </button>
          )}

          {/* Modal card */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative
              bg-[#111827]
              overflow-hidden
              shadow-2xl
              ${
                isExpanded
                  ? "w-screen h-screen rounded-none"
                  : "w-full max-w-3xl aspect-video rounded-2xl"
              }
            `}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="
                absolute top-4 left-4
                flex items-center justify-center
                w-9 h-9
                rounded-full
                bg-black/40 hover:bg-black/60
                text-white
                transition-colors
                z-10
              "
              aria-label="Close"
            >
              <CloseIcon fontSize="small" />
            </button>

            {/* Expand / collapse button */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="
                absolute top-4 right-4
                flex items-center justify-center
                w-9 h-9
                rounded-full
                bg-black/40 hover:bg-black/60
                text-white
                transition-colors
                z-10
              "
              aria-label={isExpanded ? "Exit full screen" : "Full screen"}
            >
              {isExpanded ? (
                <CloseFullscreenIcon fontSize="small" />
              ) : (
                <OpenInFullIcon fontSize="small" />
              )}
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Nav arrows inside the card when expanded */}
            {isExpanded && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    flex items-center justify-center
                    w-10 h-10
                    rounded-full
                    bg-white/10 hover:bg-white/20
                    text-white
                    transition-colors
                    z-10
                  "
                  aria-label="Previous image"
                >
                  <NavigateBeforeIcon />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    flex items-center justify-center
                    w-10 h-10
                    rounded-full
                    bg-white/10 hover:bg-white/20
                    text-white
                    transition-colors
                    z-10
                  "
                  aria-label="Next image"
                >
                  <NavigateNextIcon />
                </button>
              </>
            )}
          </motion.div>

          {/* Next button */}
          {!isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="
                hidden sm:flex
                absolute right-4 md:right-10
                items-center justify-center
                w-10 h-10
                rounded-full
                bg-white/10 hover:bg-white/20
                text-white
                transition-colors
                z-10
              "
              aria-label="Next image"
            >
              <NavigateNextIcon />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
