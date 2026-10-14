import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { toProject } from "@/lib/projects";
import type { ProjectRow } from "@/types/database";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects_and_events")
    .select("*, projects_and_events_images(id, image_url, display_order)")
    // The order admins set in the dashboard; ties (and untouched rows) fall back to newest first.
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .returns<ProjectRow[]>();

  if (error) {
    console.error("projects_and_events query failed:", error.message);
    return NextResponse.json({ data: [], error: "Failed to load projects." }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(toProject) }, { status: 200 });
}
