"use client";
import { useState, useRef, useId, useEffect } from "react";
import { motion } from "framer-motion";

interface Event {
  org: string;
  title: string;
  date: string;
  time: string;
  description: string;
  link: string;
  image: string;
  facebook: string;
  instagram: string;
}

interface EventsProps {
  events: Event[];
  isMobile: boolean;
}

export default function Events({ events, isMobile }: EventsProps) {
  const [current, setCurrent] = useState(0);
  const id = useId();

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? events.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === events.length ? 0 : next);
  };

  const handleEventClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  return (
    <div className="flex flex-col justify-center mt-0 md:mt-20 w-full max-w-md md:max-w-4xl px-4 md:px-0">
      <h2 className="text-xl font-bold text-foreground px-3 text-left mb-2">
        Events
      </h2>

      <div
        className="relative w-full"
        style={{
          overflow: "hidden",
          overflowX: "clip",
          overflowY: "visible",
          marginLeft: "-2rem",
          paddingLeft: "2rem",
        }}
        aria-labelledby={`events-heading-${id}`}
      >
        <div className="flex gap-3 md:gap-4">
          {events.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              index={index}
              current={current}
              isMobile={isMobile}
              handleEventClick={handleEventClick}
              eventsCount={events.length}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePreviousClick}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
          aria-label="Previous card"
        >
          <svg
            className="w-4 h-4 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <span className="text-foreground/60 text-sm">
          {(current + 1).toString().padStart(2, "0")}
        </span>

        <button
          onClick={handleNextClick}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
          aria-label="Next card"
        >
          <svg
            className="w-4 h-4 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  index: number;
  current: number;
  isMobile: boolean;
  handleEventClick: (index: number) => void;
  eventsCount: number;
}

const EventCard = ({
  event,
  index,
  current,
  isMobile,
  handleEventClick,
  eventsCount,
}: EventCardProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<number>(0);
  const yRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobile || !slideRef.current) return;

    const el = slideRef.current;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const isActive = current === index;

  if (isMobile && index !== current) {
    return null;
  }

  return (
    <motion.div
      className="flex-shrink-0 [perspective:1200px] [transform-style:preserve-3d]"
      style={{
        width: isMobile ? "100%" : "calc(50% - 0.5rem)",
      }}
      initial={false}
      animate={{
        x: isMobile ? 0 : `calc(-${current * 100}% - ${current * 1}rem)`,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }}
      key={isMobile ? `mobile-${index}` : `desktop-${index}`}
    >
      <motion.div
        ref={slideRef}
        className="bg-white/5 backdrop-blur-md rounded-lg p-4 md:p-6 flex flex-col cursor-pointer"
        style={{
          height: isMobile ? "350px" : "360px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: isActive
            ? "rgba(72, 187, 120, 0.8)"
            : "rgba(255, 255, 255, 0.1)",
        }}
        onClick={() => handleEventClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isActive ? 1 : 0.95,
          rotateX: isActive ? 0 : 5,
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={
          isMobile
            ? {}
            : {
                scale: isActive ? 1.02 : 0.93,
                borderColor: "rgba(72, 187, 120, 0.9)",
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }
        }
      >
        <motion.div
          className="flex flex-col flex-1 min-h-0"
          initial={isMobile ? { opacity: 0, scale: 0.9 } : false} 
          animate={{
            scale: isActive ? 1 : 0.95,
            rotateX: isActive ? 0 : 5,
            opacity: isMobile ? 1 : undefined, 
          }}
          exit={isMobile ? { opacity: 0, scale: 0.9 } : undefined} 
          transition={{ duration: 0.4, ease: "easeOut" }}
          key={`content-${index}`}
        >
          {/* Organization and Title */}
          <div className="h-16 md:h-20 mb-3 md:mb-4">
            <p className="text-xs md:text-sm text-foreground/70 mb-1 uppercase tracking-wide line-clamp-1">
              {event.org}
            </p>
            <h3 className="text-lg md:text-2xl font-bold text-foreground uppercase tracking-wide line-clamp-2">
              {event.title}
            </h3>
          </div>

          {/* Date and Time */}
          <div className="h-12 mb-3">
            <p className="text-foreground/80 text-sm font-medium line-clamp-1">
              {event.date}
            </p>
            <p className="text-foreground/70 text-xs line-clamp-1">
              {event.time}
            </p>
          </div>

          {/* Description */}
          <div className="flex-1 mb-4 min-h-0">
            <p className="text-foreground/80 text-xs md:text-sm leading-relaxed font-light line-clamp-4 overflow-hidden">
              {event.description}
            </p>
          </div>

          {/* Social Media Links and Register Button */}
          <div className="h-12 pt-3 border-t border-white/10 flex items-center gap-3">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-dark-green hover:bg-light-green/60 text-white text-xs md:text-sm font-medium py-1 px-3 md:px-4 rounded-xl transition-colors duration-300"
            >
              Register
            </a>
            <a
              href={event.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-blue-500 transition-colors duration-300"
              aria-label="Facebook post"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={event.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-pink-600 transition-colors duration-300"
              aria-label="Instagram post"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
