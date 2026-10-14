/** The organisation is based in Lipa, Philippines; event times are entered and shown in this zone. */
export const SITE_TIME_ZONE = "Asia/Manila";
// Asia/Manila has no DST, so a fixed offset is exact.
const SITE_UTC_OFFSET = "+08:00";

const ymdFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const hmFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: SITE_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const longDateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});
const shortTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

/** "2026-09-25" + "14:00" (site local time) -> ISO string for a timestamptz column. */
export function toStartsAt(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const iso = `${date}T${time}:00${SITE_UTC_OFFSET}`;
  return Number.isNaN(new Date(iso).getTime()) ? null : iso;
}

/** timestamptz -> the "YYYY-MM-DD" / "HH:mm" pair used by the admin date & time inputs. */
export function splitStartsAt(startsAt: string) {
  const d = new Date(startsAt);
  return { date: ymdFormat.format(d), time: hmFormat.format(d) };
}

const dateParts = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

function partsOf(iso: string) {
  const parts = dateParts.formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { year: get("year"), month: get("month"), day: get("day") };
}

/**
 * timestamptz start (and optional end) -> display strings shown on the public event cards.
 *   one day:      "September 25, 2026"          / "2:00 PM - 5:00 PM"
 *   same month:   "September 25 - 27, 2026"     / "2:00 PM - 5:00 PM"
 *   across month: "September 28 - October 2, 2026"
 *   across year:  "December 30, 2026 - January 2, 2027"
 * Times read as the start time on the first day to the end time on the last day.
 */
export function formatEventRange(startsAt: string, endsAt?: string | null) {
  const startTime = shortTimeFormat.format(new Date(startsAt));
  if (!endsAt) return { date: longDateFormat.format(new Date(startsAt)), time: startTime };

  const a = partsOf(startsAt);
  const b = partsOf(endsAt);
  const endTime = shortTimeFormat.format(new Date(endsAt));
  const time = endTime === startTime ? startTime : `${startTime} – ${endTime}`;

  if (a.year === b.year && a.month === b.month && a.day === b.day) {
    return { date: longDateFormat.format(new Date(startsAt)), time };
  }
  let date: string;
  if (a.year !== b.year) {
    date = `${a.month} ${a.day}, ${a.year} – ${b.month} ${b.day}, ${b.year}`;
  } else if (a.month !== b.month) {
    date = `${a.month} ${a.day} – ${b.month} ${b.day}, ${a.year}`;
  } else {
    date = `${a.month} ${a.day} – ${b.day}, ${a.year}`;
  }
  return { date, time };
}

/** Midnight (site time) of the current day, so today's events still count as upcoming. */
export function startOfTodayISO(now = new Date()) {
  return `${ymdFormat.format(now)}T00:00:00${SITE_UTC_OFFSET}`;
}

export type EventStatus = "upcoming" | "ongoing" | "past";

/**
 * Where an event (admin form values, site time) sits relative to now. "ongoing" means it has
 * started but is still listed on the website (same rule as /api/upcomingEvents); "past" ones are not.
 */
export function eventStatus(
  e: { date: string; time: string; endDate?: string; endTime?: string },
  now = new Date(),
): EventStatus {
  const start = toStartsAt(e.date, e.time);
  if (!start) return "upcoming";
  const end = (e.endDate && toStartsAt(e.endDate, e.endTime || e.time)) || start;
  if (new Date(start) > now) return "upcoming";
  if (new Date(end) >= new Date(startOfTodayISO(now))) return "ongoing";
  return "past";
}
