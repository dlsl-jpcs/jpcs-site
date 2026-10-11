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

/** timestamptz -> display strings shown on the public event cards. */
export function formatEventDateTime(startsAt: string) {
  const d = new Date(startsAt);
  return { date: longDateFormat.format(d), time: shortTimeFormat.format(d) };
}

/** Midnight (site time) of the current day, so today's events still count as upcoming. */
export function startOfTodayISO(now = new Date()) {
  return `${ymdFormat.format(now)}T00:00:00${SITE_UTC_OFFSET}`;
}
