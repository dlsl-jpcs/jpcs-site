import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { OFFICER_CATEGORIES, OFFICER_COURSES, OFFICER_YEARS, toOfficer } from "@/lib/officers";
import { isAllowedImageUrl, mediaPathFromUrl, optStr, str } from "@/lib/validation";
import type { OfficerRow } from "@/types/database";

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });

/** Whitelists and validates the admin form fields; unknown keys in the body are ignored. */
function parseOfficer(body: Record<string, unknown>) {
  const name = str(body.name);
  const position = str(body.position);
  const category = str(body.category);
  const year = str(body.year);
  const course = str(body.course);
  const image = optStr(body.image);

  if (!name || name.length > 255) return { error: "Name is required (max 255 characters)." };
  if (!position || position.length > 255) return { error: "Position is required (max 255 characters)." };
  if (!OFFICER_CATEGORIES.some((c) => c.value === category)) return { error: "Choose a group." };
  if (!(OFFICER_YEARS as readonly string[]).includes(year)) return { error: "Choose a year level." };
  if (!OFFICER_COURSES.some((c) => c.value === course)) return { error: "Choose a course." };
  if (image && !isAllowedImageUrl(image)) {
    return { error: "Photo must be uploaded to storage or be a site-relative path like /image.png." };
  }

  return {
    row: { full_name: name, position, category, year_level: year, course, image_url: image },
  };
}

/** One more than the highest order in use, i.e. the end of the list (and so of its group). */
async function nextOrder(supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>) {
  const { data } = await supabase
    .from("officers")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ display_order: number }>();
  return (data?.display_order ?? 0) + 1;
}

export async function GET() {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("officers")
    .select("*")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })
    .returns<OfficerRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load officers." }, { status: 500 });

  return NextResponse.json({ data: data.map(toOfficer) }, { status: 200 });
}

export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = parseOfficer(await req.json().catch(() => ({})));
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from("officers")
    .insert({ ...parsed.row, display_order: await nextOrder(supabase) })
    .select()
    .single<OfficerRow>();
  if (error) return NextResponse.json({ error: "Failed to save officer." }, { status: 500 });

  return NextResponse.json({ data: [toOfficer(data)] }, { status: 201 });
}

export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id)) return bad("Missing ID");

  const parsed = parseOfficer(body);
  if (!parsed.row) return bad(parsed.error!);

  const { data: before } = await supabase
    .from("officers")
    .select("image_url, category")
    .eq("id", id)
    .maybeSingle<Pick<OfficerRow, "image_url" | "category">>();
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Moving to another group puts the officer at the end of that group.
  const update =
    before.category !== parsed.row.category
      ? { ...parsed.row, display_order: await nextOrder(supabase) }
      : parsed.row;

  const { data, error } = await supabase
    .from("officers")
    .update(update)
    .eq("id", id)
    .select()
    .maybeSingle<OfficerRow>();
  if (error) return NextResponse.json({ error: "Failed to save officer." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // The photo was replaced or cleared: remove the old uploaded file from Storage.
  if (before.image_url && before.image_url !== data.image_url) {
    const oldPath = mediaPathFromUrl(before.image_url);
    if (oldPath) await supabase.storage.from("media").remove([oldPath]);
  }

  return NextResponse.json({ data: [toOfficer(data)] }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return bad("Missing ID");

  const { data, error } = await supabase
    .from("officers")
    .delete()
    .eq("id", id)
    .select("image_url")
    .maybeSingle<Pick<OfficerRow, "image_url">>();
  if (error) return NextResponse.json({ error: "Failed to delete officer." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const path = mediaPathFromUrl(data.image_url);
  if (path) await supabase.storage.from("media").remove([path]);

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
