import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { ProjectImageRow } from "@/types/database";

// One cover image per project (lowest display_order), keyed the way ProjectsEvents.tsx expects.
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects_and_events_images")
    .select("id, project_id, image_url, display_order")
    .order("display_order", { ascending: true })
    .returns<Pick<ProjectImageRow, "id" | "project_id" | "image_url" | "display_order">[]>();

  if (error) {
    console.error("projects_and_events_images query failed:", error.message);
    return NextResponse.json({ data: [], error: "Failed to load images." }, { status: 500 });
  }

  const covers = new Map<number, (typeof data)[number]>();
  for (const row of data) {
    if (!covers.has(row.project_id)) covers.set(row.project_id, row);
  }

  const result = [...covers.values()].map((row) => ({
    id: row.id,
    image_url: row.image_url,
    display_order: row.display_order,
    projects_and_events_id: row.project_id,
  }));

  return NextResponse.json({ data: result }, { status: 200 });
}
