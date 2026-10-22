import { formatEventRange, ymdInSiteZone } from "@/lib/site";
import type { Event } from "@/types/events";
import type { UpcomingEventRow } from "@/types/database";

/** One event on the public calendar; clicking it opens the same details as the hero cards. */
export type CalendarItem = {
  key: string;
  title: string;
  /** Site-local days, "YYYY-MM-DD"; endDay === startDay for single-day events. */
  startDay: string;
  endDay: string;
  time: string;
  event: Event & { id: number };
};

/** upcoming_events row -> the public Event shape the hero cards and EventDetails modal use. */
export function toPublicEvent(row: UpcomingEventRow): Event & { id: number } {
  return {
    id: row.id,
    org: row.organization_names,
    title: row.event_name,
    ...formatEventRange(row.starts_at, row.ends_at),
    location: row.event_location ?? "",
    description: row.event_description,
    link: row.registration_link ?? "",
    image: row.image_url ?? "",
    facebook: row.facebook_link ?? "",
    instagram: row.instagram_link ?? "",
  };
}

export function eventToItem(row: UpcomingEventRow): CalendarItem {
  const startDay = ymdInSiteZone(row.starts_at);
  const event = toPublicEvent(row);
  return {
    key: `e${row.id}`,
    title: row.event_name,
    startDay,
    endDay: row.ends_at ? ymdInSiteZone(row.ends_at) : startDay,
    time: event.time,
    event,
  };
}

// --- Calendar-day arithmetic on "YYYY-MM-DD" strings. Done in UTC so it is DST- and zone-free;
// the strings already represent site-local days.

const toUTC = (ymd: string) => new Date(`${ymd}T00:00:00Z`);
const fromUTC = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(ymd: string, n: number) {
  const d = toUTC(ymd);
  d.setUTCDate(d.getUTCDate() + n);
  return fromUTC(d);
}

/** Monday = 0 … Sunday = 6. */
export function weekdayIndex(ymd: string) {
  return (toUTC(ymd).getUTCDay() + 6) % 7;
}

/** "2026-10" -> its parts, or null if malformed / out of range. */
export function parseMonth(value: string | null | undefined) {
  const m = /^(\d{4})-(\d{2})$/.exec(value ?? "");
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12 || year < 2000 || year > 2100) return null;
  return { year, month };
}

export const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;

export function shiftMonth(key: string, delta: number) {
  const p = parseMonth(key)!;
  const index = p.year * 12 + (p.month - 1) + delta;
  return monthKey(Math.floor(index / 12), (index % 12) + 1);
}

/** The month containing today, in site time. */
export function currentMonthKey(now = new Date()) {
  return ymdInSiteZone(now).slice(0, 7);
}

/**
 * The Monday-to-Sunday weeks covering a month, as a list of days. `start`/`end` bound the grid,
 * including the leading and trailing days of neighbouring months.
 */
export function monthGrid(key: string) {
  const p = parseMonth(key)!;
  const first = `${key}-01`;
  const last = fromUTC(new Date(Date.UTC(p.year, p.month, 0)));
  const start = addDays(first, -weekdayIndex(first));
  const end = addDays(last, 6 - weekdayIndex(last));
  const days: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
  return { start, end, first, last, days };
}

const dayFormat = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });
const monthFormat = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" });

/** "2026-10-08" (+ end) -> "October 8, 2026" or "October 8, 2026 – October 10, 2026". */
export function formatDayRange(start: string, end: string) {
  const a = dayFormat.format(toUTC(start));
  return start === end ? a : `${a} – ${dayFormat.format(toUTC(end))}`;
}

/** "2026-10" -> "October 2026". */
export function formatMonth(key: string) {
  return monthFormat.format(toUTC(`${key}-01`));
}

/** Items covering a given day. */
export function itemsOn(items: CalendarItem[], day: string) {
  return items.filter((i) => i.startDay <= day && i.endDay >= day);
}
