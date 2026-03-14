"use client";

import { Event } from "@/types/events";
import EventCarousel from "./EventCarousel";

interface EventsProps {
  events: Event[];
  isMobile: boolean;
}

export default function Events({ events, isMobile }: EventsProps) {
  return (
    <div className="flex flex-col justify-center mt-0 md:mt-20 w-full max-w-[18.5rem] min-[401px]:max-w-[21rem] md:max-w-2xl px-2 min-[401px]:px-4 md:px-0">
      <div className="flex items-center gap-2 min-[401px]:gap-3 mb-2 min-[401px]:mb-3 px-2 min-[401px]:px-3">
        <h2 className="text-lg min-[401px]:text-xl font-extrabold text-white tracking-tight">
          Upcoming Events
        </h2>
      </div>

      <EventCarousel events={events} isMobile={isMobile} />
    </div>
  );
}
