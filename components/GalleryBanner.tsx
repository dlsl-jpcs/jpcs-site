"use client";

import React from "react";
import { motion } from "motion/react";

const GalleryBanner: React.FC = () => {
  const text1 = "GALLERY · JPCS";
  const text2 = "DE LA SALLE LIPA · JPCS ·";

  const items1 = Array(8).fill(text1);
  const items2 = Array(8).fill(text2);

  return (
    <div className="relative w-full overflow-hidden border-t-3 border-[#C4FF4D]">
      {/* Strip 1 - moves left */}
      <div className="bg-background py-2 min-[401px]:py-2.5 overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...items1, ...items1].map((text, i) => (
            <div key={i} className="flex items-center whitespace-nowrap">
              <span className=" px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-xs md:text-sm font-bold text-[#9EA1A6] tracking-widest uppercase">
                {text}
              </span>

              <span className="text-[#9EA1A6] text-sm md:text-lg">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryBanner;
