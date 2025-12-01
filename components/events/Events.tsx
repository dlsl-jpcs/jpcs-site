
"use client";

import { Event } from "@/types/events";
import EventCarousel from "./EventCarousel";

interface EventsProps {
  events: Event[];
  isMobile: boolean;
}

export default function Events({ events, isMobile }: EventsProps) {
  return (
    <div className="flex flex-col justify-center mt-0 md:mt-20 w-full max-w-md md:max-w-4xl px-4 md:px-0">
      <h2 className="text-xl font-bold text-foreground px-3 text-left mb-2">
        Upcoming Events
      </h2>

      <EventCarousel events={events} isMobile={isMobile} />
    </div>
  );
}
