import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { formatEventRange, startOfTodayISO } from "@/lib/site";
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

  const events = data.map((row) => ({
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
  }));

  return NextResponse.json({ data: events }, { status: 200 });
}
