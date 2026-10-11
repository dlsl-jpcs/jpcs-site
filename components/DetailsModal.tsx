"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { useModalA11y } from "@/lib/useModalA11y";

interface DetailsModalProps {
  onClose: () => void;
  /** id of the element inside `children` that names the dialog */
  labelledBy: string;
  describedBy?: string;
  closeLabel: string;
  children: ReactNode;
}

/**
 * Shared shell for the event and project detail modals: portal, backdrop,
 * Escape / outside-click / close-button dismissal, focus trap and scroll lock.
 */
export default function DetailsModal({
  onClose,
  labelledBy,
  describedBy,
  closeLabel,
  children,
}: DetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
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

  if (!mounted) return null;

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
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[650px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D172F] text-white shadow-2xl outline-none sm:max-h-[min(90dvh,760px)]"
      >
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label={closeLabel}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#27334C] text-white transition-colors hover:bg-[#33415f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon sm:right-4 sm:top-4"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export const socialLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-neon/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon";
