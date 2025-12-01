"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "./EventCard";
import { Event } from "@/types/events";

interface EventCarouselProps {
  events: Event[];
  isMobile: boolean;
}

export default function EventCarousel({
  events,
  isMobile,
}: EventCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const index = isMobile
    ? ((page % events.length) + events.length) % events.length
    : current;

  const handlePrevious = () => {
    if (isMobile) {
      paginate(-1);
    } else {
      setCurrent((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  const handleNext = () => {
    if (isMobile) {
      paginate(1);
    } else {
      setCurrent((prev) => (prev + 1) % events.length);
    }
  };

  const handleDotClick = (i: number) => {
    if (isMobile) {
      setPage([i, i > index ? 1 : -1]);
    } else {
      setCurrent(i);
    }
  };

  return (
    <>
      {/* Desktop*/}
      {!isMobile && (
        <div
          className="relative w-full"
          style={{
            overflow: "hidden",
            overflowX: "clip",
            overflowY: "visible",
            marginLeft: "-2rem",
            paddingLeft: "2rem",
          }}
        >
          <div className="flex gap-3 md:gap-4">
            {events.map((event, i) => (
              <EventCard
                key={i}
                event={event}
                index={i}
                current={current}
                isMobile={false}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile*/}
      {isMobile && (
        <div className="relative w-full h-[380px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={{
                enter: (direction: number) => ({
                  x: direction > 0 ? "100%" : "-100%",
                  opacity: 0,
                }),
                center: { x: 0, opacity: 1 },
                exit: (direction: number) => ({
                  x: direction < 0 ? "100%" : "-100%",
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipeThreshold = 50;
                const swipePower = Math.abs(offset.x) + Math.abs(velocity.x);
                if (swipePower > 8000 || Math.abs(offset.x) > swipeThreshold) {
                  if (offset.x > 0) paginate(-1);
                  else paginate(1);
                }
              }}
              className="absolute inset-0"
            >
              <EventCard
                event={events[index]}
                index={index}
                current={index}
                isMobile={true}
                onClick={() => {}}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Navigation — same for both */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePrevious}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
          aria-label="Previous card"
        >
          <svg
            className="w-4 h-4 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          {(index + 1).toString().padStart(2, "0")}
        </span>

        <button
          onClick={handleNext}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
          aria-label="Next card"
        >
          <svg
            className="w-4 h-4 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
    </>
  );
}
