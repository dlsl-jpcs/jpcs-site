import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { addDays, eventToItem, monthGrid, parseMonth } from "@/lib/calendar";
import { siteMidnightISO } from "@/lib/site";
import type { UpcomingEventRow } from "@/types/database";

/**
 * Every event on the calendar grid for one month (?month=YYYY-MM), including the neighbouring
 * months' leading/trailing days the Monday-to-Sunday grid shows. Public and the same for
 * everyone, so the CDN caches it briefly.
 */
export async function GET(req: Request) {
  const month = new URL(req.url).searchParams.get("month");
  if (!parseMonth(month)) {
    return NextResponse.json({ error: "Use ?month=YYYY-MM." }, { status: 400 });
  }

  const { start, end } = monthGrid(month!);
  const startISO = siteMidnightISO(start);
  const endExclusiveISO = siteMidnightISO(addDays(end, 1));

  const supabase = await createClient();
  // Overlaps the grid: starts before it ends, and ends (or, with no end, starts) inside it.
  const { data, error } = await supabase
    .from("upcoming_events")
    .select("*")
    .lt("starts_at", endExclusiveISO)
    .or(`ends_at.gte.${startISO},starts_at.gte.${startISO}`)
    .order("starts_at", { ascending: true })
    .returns<UpcomingEventRow[]>();

  if (error) {
    console.error("calendar query failed:", error.message);
    return NextResponse.json({ error: "Failed to load the calendar." }, { status: 500 });
  }

  return NextResponse.json(
    { items: data.map(eventToItem) },
    { status: 200, headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
