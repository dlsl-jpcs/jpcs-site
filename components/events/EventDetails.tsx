"use client";

import { useId } from "react";
import Image from "next/image";
import { Event } from "@/types/events";
import DetailsModal, { socialLinkClass } from "../DetailsModal";

interface Props {
  event: Event;
  onClose: () => void;
}

function Row({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 text-sm font-medium text-gray-200 sm:text-base">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-neon sm:h-5 sm:w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          d={icon}
        />
      </svg>
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}

const ICON_CALENDAR =
  "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z";
const ICON_CLOCK = "M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z";
const ICON_PIN =
  "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z";

/** Full details for an upcoming event; this is where the event image is shown. */
export default function EventDetails({ event, onClose }: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const hasImage = Boolean(event.image);

  return (
    <DetailsModal
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      closeLabel="Close event details"
    >
      <div className="relative aspect-[16/10] w-full bg-[#0D1522] sm:aspect-video">
        <Image
          src={hasImage ? event.image : "/jpcslogo.png"}
          alt={hasImage ? `${event.title} poster` : "JPCS logo"}
          fill
          sizes="(min-width: 700px) 650px, 95vw"
          className={hasImage ? "object-contain" : "object-contain p-10"}
          priority
        />
      </div>

      <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
        {event.org && (
          <p className="mb-1 text-sm font-medium text-gray-400">{event.org}</p>
        )}
        <h3
          id={titleId}
          className="break-words text-xl font-bold leading-tight sm:text-2xl"
        >
          {event.title}
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          <Row icon={ICON_CALENDAR}>{event.date}</Row>
          {event.time && <Row icon={ICON_CLOCK}>{event.time}</Row>}
          {event.location && <Row icon={ICON_PIN}>{event.location}</Row>}
        </div>

        <p
          id={descriptionId}
          className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300 sm:text-base"
        >
          {event.description}
        </p>

        {(event.link || event.facebook || event.instagram) && (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-neon px-6 py-2.5 text-sm font-extrabold text-navy transition-colors hover:bg-neon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Register Now
                <span className="sr-only"> (opens in new window)</span>
              </a>
            )}
            {event.facebook && (
              <a
                href={event.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
              >
                Facebook
                <span className="sr-only"> (opens in new window)</span>
              </a>
            )}
            {event.instagram && (
              <a
                href={event.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLinkClass}
              >
                Instagram
                <span className="sr-only"> (opens in new window)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </DetailsModal>
  );
}
