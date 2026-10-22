"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import DetailsModal from "@/components/DetailsModal";
import EventDetails from "@/components/events/EventDetails";
import CircuitTraces from "@/components/tech/CircuitTraces";
import GridSpotlight from "@/components/tech/GridSpotlight";
import ScrambleText from "@/components/tech/ScrambleText";
import SectionTag from "@/components/tech/SectionTag";
import {
  formatDayRange,
  formatMonth,
  itemsOn,
  monthGrid,
  shiftMonth,
  weekdayIndex,
  type CalendarItem,
} from "@/lib/calendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS = 3;
const SHORT_DAY = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short", day: "2-digit", month: "short" });

type Selection = { item: CalendarItem } | { day: string } | null;

/** Month view of events: a grid on desktop, an agenda list on phones. */
export default function CalendarView({ month, today }: { month: string; today: string }) {
  const grid = useMemo(() => monthGrid(month), [month]);
  const cache = useRef(new Map<string, CalendarItem[]>());
  const [items, setItems] = useState<CalendarItem[] | null>(null);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Selection>(null);

  const fetchMonth = useCallback(async (key: string) => {
    const hit = cache.current.get(key);
    if (hit) return hit;
    const res = await fetch(`/api/calendar?month=${key}`);
    if (!res.ok) throw new Error(`calendar ${res.status}`);
    const data: CalendarItem[] = (await res.json()).items ?? [];
    cache.current.set(key, data);
    return data;
  }, []);

  const load = useCallback(() => {
    let cancelled = false;
    setError(false);
    setItems(cache.current.get(month) ?? null);
    fetchMonth(month)
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        // Warm the neighbours so prev/next feel instant.
        fetchMonth(shiftMonth(month, 1)).catch(() => {});
        fetchMonth(shiftMonth(month, -1)).catch(() => {});
      })
      .catch((err) => {
        console.error("Error loading calendar:", err);
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [month, fetchMonth]);

  useEffect(() => load(), [load]);

  // Agenda/empty message only count days inside the month, not the grid's spill-over days.
  const monthDays = grid.days.filter((d) => d >= grid.first && d <= grid.last);
  const agenda = monthDays.map((day) => ({ day, list: itemsOn(items ?? [], day) })).filter((d) => d.list.length);

  const navLink =
    "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-neon/60 hover:text-neon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon";

  return (
    <section className="relative min-h-screen overflow-hidden bg-navy pb-36 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <GridSpotlight />
      <CircuitTraces tone="dark" corners={["tr", "bl"]} className="hidden lg:block" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 min-[401px]:px-6 md:px-16 md:pt-40">
        <Link
          href="/#home"
          className="mb-8 flex w-fit items-center gap-2 text-sm font-medium text-white/50 transition-colors duration-200 hover:text-neon"
        >
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <SectionTag label="// calendar" tone="dark" />
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight min-[401px]:text-5xl md:text-6xl">
          Calendar of{" "}
          <span className="inline-block -rotate-2 rounded-full bg-neon px-4 py-1 text-navy">
            <ScrambleText text="Activities" />
          </span>
        </h1>
        <p className="mt-4 max-w-xl font-medium text-white/60">JPCS events, past and upcoming. Tap one for details.</p>

        {/* Month bar */}
        <div className="mt-10 flex items-center gap-3">
          <Link href={`/calendar?month=${shiftMonth(month, -1)}`} scroll={false} aria-label="Previous month" className={navLink}>
            <NavigateBeforeIcon fontSize="small" />
          </Link>
          <h2 aria-live="polite" className="min-w-[10.5rem] text-center font-mono text-base font-medium sm:text-lg">
            {formatMonth(month)}
          </h2>
          <Link href={`/calendar?month=${shiftMonth(month, 1)}`} scroll={false} aria-label="Next month" className={navLink}>
            <NavigateNextIcon fontSize="small" />
          </Link>
          {today.slice(0, 7) !== month && (
            <Link
              href="/calendar"
              scroll={false}
              className="ml-1 rounded-full border border-white/10 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-neon/60 hover:text-neon"
            >
              today
            </Link>
          )}
        </div>

        {error ? (
          <div role="alert" className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
            <p className="font-bold">Couldn&apos;t load the calendar.</p>
            <p className="mt-1 text-sm text-white/60">Check your connection and try again.</p>
            <button
              type="button"
              onClick={load}
              className="mt-5 rounded-full bg-neon px-5 py-2 text-sm font-bold text-navy transition-colors hover:bg-neon-hover"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Desktop: month grid */}
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-white/10 md:block" aria-busy={items === null}>
              <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.03]">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-white/45">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {grid.days.map((day) => {
                  const inMonth = day >= grid.first && day <= grid.last;
                  const list = items ? itemsOn(items, day) : [];
                  const extra = list.length - MAX_CHIPS;
                  return (
                    <div
                      key={day}
                      className={`relative min-h-[7.5rem] border-b border-r border-white/[0.07] p-1.5 [&:nth-child(7n)]:border-r-0 ${
                        inMonth ? "bg-white/[0.015]" : "bg-black/10"
                      }`}
                    >
                      <span
                        className={`mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 font-mono text-xs ${
                          day === today ? "bg-neon font-bold text-navy" : inMonth ? "text-white/70" : "text-white/25"
                        }`}
                      >
                        {Number(day.slice(8))}
                        {day === today && <span className="sr-only"> (today)</span>}
                      </span>
                      {items === null ? (
                        inMonth && Number(day.slice(8)) % 4 === 1 && <div className="h-5 animate-pulse rounded bg-white/10" />
                      ) : (
                        <div className="space-y-1">
                          {list.slice(0, MAX_CHIPS).map((item) => (
                            <Chip key={item.key} item={item} day={day} onOpen={() => setSelected({ item })} />
                          ))}
                          {extra > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelected({ day })}
                              className="w-full rounded px-1.5 text-left font-mono text-[11px] text-white/55 hover:text-neon"
                            >
                              +{extra} more
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phones: agenda list */}
            <div className="mt-6 md:hidden" aria-busy={items === null}>
              {items === null ? (
                <div className="space-y-3" role="status">
                  <span className="sr-only">Loading calendar</span>
                  {[0, 1, 2].map((i) => (
                    <div key={i} aria-hidden="true" className="h-20 animate-pulse rounded-2xl bg-white/[0.06]" />
                  ))}
                </div>
              ) : (
                <ol className="space-y-5">
                  {agenda.map(({ day, list }) => (
                    <li key={day}>
                      <p className={`mb-2 font-mono text-xs ${day === today ? "text-neon" : "text-white/50"}`}>
                        {SHORT_DAY.format(new Date(`${day}T00:00:00Z`))}
                        {day === today && " · today"}
                      </p>
                      <ul className="space-y-2">
                        {list.map((item) => (
                          <li key={item.key}>
                            <AgendaRow item={item} day={day} onOpen={() => setSelected({ item })} />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {items !== null && agenda.length === 0 && (
              <p className="mt-6 rounded-2xl border border-dashed border-white/15 px-5 py-6 text-center text-sm text-white/60">
                No events in {formatMonth(month).split(" ")[0]} yet. Check another month.
              </p>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected && "item" in selected && (
          <EventDetails key="event" event={selected.item.event} onClose={() => setSelected(null)} />
        )}
        {selected && "day" in selected && (
          <DayDetails
            key="day"
            day={selected.day}
            items={itemsOn(items ?? [], selected.day)}
            onOpen={(item) => setSelected({ item })}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/** A grid chip. Days after the first of a multi-day event get a continuation arrow. */
function Chip({ item, day, onOpen }: { item: CalendarItem; day: string; onOpen: () => void }) {
  const continued = day !== item.startDay && weekdayIndex(day) !== 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      title={item.title}
      className="block w-full truncate rounded bg-neon px-1.5 py-0.5 text-left text-[11px] font-bold leading-snug text-navy transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neon"
    >
      {continued ? `↳ ${item.title}` : item.title}
    </button>
  );
}

const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

function AgendaRow({ item, day, onOpen }: { item: CalendarItem; day: string; onOpen: () => void }) {
  const multi = item.startDay !== item.endDay;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-neon/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
    >
      <span className="font-bold leading-snug">{item.title}</span>
      <span className="mt-0.5 font-mono text-[11px] text-white/50">
        {item.time}
        {multi && ` · day ${daysBetween(item.startDay, day) + 1} of ${daysBetween(item.startDay, item.endDay) + 1}`}
      </span>
    </button>
  );
}

function DayDetails({
  day,
  items,
  onOpen,
  onClose,
}: {
  day: string;
  items: CalendarItem[];
  onOpen: (item: CalendarItem) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  return (
    <DetailsModal onClose={onClose} labelledBy={titleId} closeLabel="Close day">
      <div className="p-6 pr-16 sm:p-8 sm:pr-20">
        <h2 id={titleId} className="font-mono text-lg text-neon">
          {formatDayRange(day, day)}
        </h2>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.key}>
              <AgendaRow item={item} day={day} onOpen={() => onOpen(item)} />
            </li>
          ))}
        </ul>
      </div>
    </DetailsModal>
  );
}
