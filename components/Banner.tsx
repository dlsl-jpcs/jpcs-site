"use client";

import React from "react";

const Banner: React.FC = () => {
  const text1 = "JUNIOR PHILIPPINE COMPUTER SOCIETY";
  const text2 = "DE LA SALLE LIPA · JPCS ·";

  return (
    <div className="w-full overflow-hidden">
      {/* Strip 1: white bg, dark green text, scrolls left */}
      <div className="bg-white py-2 min-[401px]:py-2.5">
        <div className="flex animate-marquee-left">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex whitespace-nowrap items-center">
              <span className="px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-sm md:text-lg font-bold text-dark-green tracking-widest uppercase">
                {text1}
              </span>
              <span className="text-dark-green/30 text-base min-[401px]:text-lg">✦</span>
            </div>
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={`b${i}`} className="flex whitespace-nowrap items-center">
              <span className="px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-sm md:text-lg font-bold text-dark-green tracking-widest uppercase">
                {text1}
              </span>
              <span className="text-dark-green/30 text-base min-[401px]:text-lg">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strip 2: light green bg, dark bg text, scrolls right */}
      <div className="bg-light-green py-2 min-[401px]:py-2.5">
        <div className="flex animate-marquee-right">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex whitespace-nowrap items-center">
              <span className="px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-sm md:text-lg font-bold text-background tracking-widest uppercase">
                {text2}
              </span>
            </div>
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`b${i}`} className="flex whitespace-nowrap items-center">
              <span className="px-4 min-[401px]:px-6 text-[11px] min-[401px]:text-sm md:text-lg font-bold text-background tracking-widest uppercase">
                {text2}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
