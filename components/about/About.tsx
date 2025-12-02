import React from "react";
import ProgramsUnder from "./ProgramsUnder";

const About = () => {
  return (
    <div
      id="about"
      className="relative w-screen min-h-screen bg-white overflow-hidden"
    >
      {/* Full-height background – works on mobile & desktop */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1400 900"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice" // ← This is the key for mobile!
        >
          <defs>
            <radialGradient id="centerFade">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="60%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="dotGlow">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#centerFade)" />
          </mask>

          {/* Curved Grid */}
          <g
            mask="url(#fadeMask)"
            stroke="#10b981"
            strokeWidth="1.4"
            fill="none"
          >
            {[120, 260, 400, 540, 680, 780].map((y, i) => (
              <path
                key={`h${i}`}
                d={`M-200,${y} Q400,${y + 80 * Math.sin(i + 1)} 700,${
                  y + 50
                } T1400,${y + 30 * Math.cos(i)}`}
                opacity="0.28"
              />
            ))}

            {[200, 500, 800, 1100].map((x, i) => (
              <path
                key={`v${i}`}
                d={`M${x},0 Q${x + 120 * Math.sin(i + 2)},300 ${x - 60},600 T${
                  x + 50
                },900`}
                opacity="0.22"
              />
            ))}
          </g>

          {/* Animated Dots */}
          <g>
            <circle r="5" fill="url(#dotGlow)">
              <animateMotion
                path="M100,200 Q500,100 900,300 T1300,200 T1300,600 T900,750 T100,700 T100,200"
                dur="30s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="4" fill="url(#dotGlow)">
              <animateMotion
                path="M300,700 Q700,800 1100,650"
                dur="26s"
                repeatCount="indefinite"
                begin="7s"
              />
            </circle>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-10">
        <ProgramsUnder />
      </div>
    </div>
  );
};

export default About;
