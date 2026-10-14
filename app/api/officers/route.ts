import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { toOfficer } from "@/lib/officers";
import type { OfficerRow } from "@/types/database";

// Officers in the order set in the admin dashboard; the website groups them by category.
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("officers")
    .select("*")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })
    .returns<OfficerRow[]>();

  if (error) {
    console.error("officers query failed:", error.message);
    return NextResponse.json({ data: [], error: "Failed to load officers." }, { status: 500 });
  }

  return NextResponse.json({ data: data.map(toOfficer) }, { status: 200 });
}
