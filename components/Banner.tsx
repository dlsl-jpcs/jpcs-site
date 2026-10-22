"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useVelocityMarquee } from "./tech/hooks";

const GLYPHS = ["</>", "{ }", "0x", "&&"];

const Banner: React.FC = () => {
  const text1 = "JUNIOR PHILIPPINE COMPUTER SOCIETY";
  const text2 = "DE LA SALLE LIPA // JPCS //";

  // Both strips drift at the old 20s-per-half pace (2.5%/s) and surge while the page scrolls.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const left = useVelocityMarquee(-2.5, inView);
  const right = useVelocityMarquee(2.5, inView);

  return (
    // Decorative: the repeated name would otherwise be read out ~20 times.
    <div ref={ref} className="w-full overflow-hidden" aria-hidden="true">
      {/* Strip 1: white bg, dark green text, scrolls left */}
      <div className="bg-white py-2 min-[401px]:py-2.5">
        <motion.div className="flex w-max" style={{ x: left.x, skewX: left.skew }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex whitespace-nowrap items-center">
              <span className="px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-sm md:text-lg font-bold text-dark-green tracking-widest uppercase">
                {text1}
              </span>
              <span className="font-mono font-bold text-dark-green/35 text-xs min-[401px]:text-sm md:text-base">
                {GLYPHS[i % GLYPHS.length]}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Strip 2: light green bg, dark bg text, scrolls right */}
      <div className="bg-light-green py-2 min-[401px]:py-2.5">
        <motion.div className="flex w-max" style={{ x: right.x, skewX: right.skew }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex whitespace-nowrap items-center">
              <span className="px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-sm md:text-lg font-bold text-background tracking-widest uppercase">
                {text2}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
