import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { toPublicEvent } from "@/lib/calendar";
import { startOfTodayISO } from "@/lib/site";
import type { UpcomingEventRow } from "@/types/database";

// Upcoming = starting today (site time) or later, or still running today; soonest first.
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("upcoming_events")
    .select("*")
    .or(`starts_at.gte.${startOfTodayISO()},ends_at.gte.${startOfTodayISO()}`)
    .order("starts_at", { ascending: true })
    .returns<UpcomingEventRow[]>();

  if (error) {
    console.error("upcoming_events query failed:", error.message);
    return NextResponse.json({ data: [], error: "Failed to load events." }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(toPublicEvent) }, { status: 200 });
}
