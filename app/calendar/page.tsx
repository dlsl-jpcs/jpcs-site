import type { Metadata } from "next";
import CalendarView from "@/components/calendar/CalendarView";
import { currentMonthKey, parseMonth } from "@/lib/calendar";
import { ymdInSiteZone } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calendar of Activities | JPCS DLSL",
  description: "Events, meetings, deadlines and exam weeks of the Junior Philippine Computer Society, De La Salle Lipa.",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  // "Today" comes from the server in site time, so the client renders the same grid it hydrates.
  const now = new Date();
  return (
    <CalendarView
      month={parseMonth(month) ? month! : currentMonthKey(now)}
      today={ymdInSiteZone(now)}
    />
  );
}
