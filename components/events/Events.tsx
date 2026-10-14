"use client";

import { Event } from "@/types/events";
import EventCarousel from "./EventCarousel";

interface EventsProps {
  events: Event[];
  isMobile: boolean;
  loading?: boolean;
}

export default function Events({ events, isMobile, loading = false }: EventsProps) {
  return (
    <div className="flex flex-col justify-center mt-0 md:mt-20 w-full max-w-[18.5rem] min-[401px]:max-w-[23rem] md:max-w-2xl px-2 min-[401px]:px-4 md:px-0">
      <div className="flex items-center gap-2 min-[401px]:gap-3 mb-2 min-[401px]:mb-3 px-2 min-[401px]:px-3">
        <h2 className="text-lg min-[401px]:text-xl font-extrabold text-white tracking-tight">
          Upcoming Events
        </h2>
      </div>

      {loading ? (
        <div
          role="status"
          className="w-full md:w-[calc(60%-0.5rem)] h-[340px] min-[401px]:h-[380px] md:h-[400px] rounded-[1.5rem] min-[401px]:rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-4 min-[401px]:p-6 md:p-8 flex flex-col"
        >
          <span className="sr-only">Loading upcoming events</span>
          <div aria-hidden="true" className="flex flex-1 flex-col animate-pulse">
            <div className="h-3 w-12 rounded-full bg-white/10" />
            <div className="mt-3 h-7 w-4/5 rounded-full bg-white/15" />
            <div className="mt-2 h-7 w-3/5 rounded-full bg-white/15" />
            <div className="mt-5 h-4 w-2/5 rounded-full bg-white/10" />
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full rounded-full bg-white/10" />
              <div className="h-3 w-11/12 rounded-full bg-white/10" />
            </div>
            <div className="mt-auto h-10 w-36 rounded-full bg-white/10" />
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="mx-2 min-[401px]:mx-3 rounded-[1.5rem] border border-dashed border-white/15 px-5 py-8 md:max-w-[22rem]">
          <p className="font-bold text-white">Nothing scheduled yet</p>
          <p className="mt-1 text-sm leading-relaxed text-white/60">
            New events are announced on our{" "}
            <a
              href="https://www.facebook.com/JPCS.DLSL"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neon underline-offset-4 hover:underline"
            >
              Facebook page
              <span className="sr-only"> (opens in new window)</span>
            </a>{" "}
            first.
          </p>
        </div>
      ) : (
        <EventCarousel events={events} isMobile={isMobile} />
      )}
    </div>
  );
}
