"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function IntroSplash({
  children,
}: {
  children: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showIntro, setShowIntro] = useState(true);

  useState(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  });

  const finishIntro = () => {
    setShowIntro(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onEnded={finishIntro}
              onError={finishIntro}
              className="w-full h-full object-cover"
            >
              <source src="/intro.mp4" type="video/mp4" />
            </video>

            <button
              onClick={finishIntro}
              className="
                absolute bottom-6 right-6 sm:bottom-10 sm:right-10
                px-5 py-2.5
                rounded-full
                bg-white/10 hover:bg-white/20
                backdrop-blur-sm
                border border-white/20
                text-white text-sm font-medium
                tracking-wide
                transition-colors
              "
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
