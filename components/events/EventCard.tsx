import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Event } from "@/types/events";

interface EventCardProps {
  event: Event;
  index: number;
  current: number;
  isMobile: boolean;
  onClick: () => void;
}

export default function EventCard({
  event,
  index,
  current,
  isMobile,
  onClick,
}: EventCardProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const isActive = current === index;

  useEffect(() => {
    if (isMobile) return;

    const animate = () => {
      if (!slideRef.current) return;

      slideRef.current.style.setProperty("--x", `${xRef.current}px`);
      slideRef.current.style.setProperty("--y", `${yRef.current}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !slideRef.current) return;

    const r = slideRef.current.getBoundingClientRect();
    xRef.current = e.clientX - (r.left + r.width / 2);
    yRef.current = e.clientY - (r.top + r.height / 2);
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  if (isMobile && !isActive) return null;

  return (
    <motion.div
      className="flex-shrink-0 [perspective:1200px] [transform-style:preserve-3d]"
      style={{ width: isMobile ? "100%" : "calc(60% - 0.5rem)" }}
      initial={false}
      animate={{
        x: isMobile ? 0 : `calc(-${current * 100}% - ${current * 1}rem)`,
        opacity: isActive ? 1 : 0.4,
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        ref={slideRef}
        className={`relative rounded-[1.1rem] min-[401px]:rounded-[1.3rem] p-4 min-[401px]:p-6 md:p-8 h-[340px] min-[401px]:h-[380px] md:h-[400px] flex flex-col cursor-pointer overflow-hidden transition-all duration-500 ${
          isActive
            ? "bg-white/10 backdrop-blur-2xl border border-neon/50 shadow-[0_20px_40px_-10px_rgba(196,255,71,0.15)]"
            : "bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20"
        }`}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ scale: isActive ? 1 : 0.9, rotateX: isActive ? 0 : 4 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        whileHover={
          isMobile
            ? {}
            : {
                scale: isActive ? 1.02 : 0.92,
              }
        }
      >
        {isActive && (
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon/20 rounded-2xl blur-[60px] pointer-events-none" />
        )}

        <motion.div className="flex flex-col flex-1 min-h-0 relative z-10">
          <div className="mb-3 min-[401px]:mb-4">
            <h3 className="text-xl min-[401px]:text-2xl md:text-3xl font-extrabold text-white leading-tight line-clamp-2">
              {event.title}
            </h3>
          </div>

          <div className="mb-3 min-[401px]:mb-4 flex items-center gap-2 min-[401px]:gap-3 text-white/70">
            <div className="flex flex-col">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-neon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {event.date}
              </p>
              <p className="text-xs font-medium text-white/50 mt-1 ml-6">
                {event.time}
              </p>
            </div>
          </div>

          <div className="flex-1 mb-4 min-[401px]:mb-6 min-h-0">
            <p className="text-white/60 text-sm leading-relaxed font-medium line-clamp-3">
              {event.description}
            </p>
          </div>

          <div className="pt-4 min-[401px]:pt-5 border-t border-white/10 flex items-center justify-between mt-auto gap-2">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-neon text-navy hover:bg-neon-hover text-xs min-[401px]:text-sm font-extrabold py-2 min-[401px]:py-2.5 px-4 min-[401px]:px-6 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(196,255,71,0.2)]"
            >
              Register Now
            </a>

            <div className="flex items-center gap-3 min-[401px]:gap-4">
              <a
                href={event.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${event.title} on Facebook (opens in new window)`}
                className="text-white/40 hover:text-neon transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={event.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${event.title} on Instagram (opens in new window)`}
                className="text-white/40 hover:text-neon transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
