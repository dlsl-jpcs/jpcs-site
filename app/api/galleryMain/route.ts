import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { GalleryRow } from "@/types/database";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_main")
    .select("id, image_url, alt_text, display_order")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })
    .returns<Pick<GalleryRow, "id" | "image_url" | "alt_text" | "display_order">[]>();

  if (error) {
    console.error("gallery_main query failed:", error.message);
    return NextResponse.json({ data: [], error: "Failed to load gallery." }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
