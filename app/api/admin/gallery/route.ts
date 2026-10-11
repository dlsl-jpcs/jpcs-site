import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { isAllowedImageUrl, mediaPathFromUrl, str } from "@/lib/validation";
import type { GalleryRow } from "@/types/database";

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });

// ?target=main (default) -> homepage carousel (gallery_main); ?target=gallery -> full gallery page.
function tableFor(req: Request) {
  return new URL(req.url).searchParams.get("target") === "gallery" ? "gallery" : "gallery_main";
}

function parseImage(body: Record<string, unknown>) {
  const imageUrl = str(body.image_url);
  const order = Number(body.display_order ?? 0);
  const alt = str(body.alt_text);

  if (!imageUrl) return { error: "Image is required." };
  if (!isAllowedImageUrl(imageUrl)) {
    return { error: "Image must be uploaded to storage or be a site-relative path like /image.png." };
  }
  if (!Number.isInteger(order)) return { error: "Display order must be a whole number." };
  if (alt.length > 255) return { error: "Alt text is too long (max 255 characters)." };

  return { row: { image_url: imageUrl, alt_text: alt, display_order: order } };
}

export async function GET(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from(tableFor(req))
    .select("*")
    .order("display_order", { ascending: true })
    .order("id", { ascending: false })
    .returns<GalleryRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load gallery." }, { status: 500 });

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = parseImage(await req.json().catch(() => ({})));
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from(tableFor(req))
    .insert(parsed.row)
    .select()
    .single<GalleryRow>();
  if (error) return NextResponse.json({ error: "Failed to add image." }, { status: 500 });

  return NextResponse.json({ data: [data] }, { status: 201 });
}

export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id)) return bad("Missing ID");

  const parsed = parseImage(body);
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from(tableFor(req))
    .update(parsed.row)
    .eq("id", id)
    .select()
    .maybeSingle<GalleryRow>();
  if (error) return NextResponse.json({ error: "Failed to save image." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: [data] }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return bad("Missing ID");

  const { data, error } = await supabase
    .from(tableFor(req))
    .delete()
    .eq("id", id)
    .select("image_url")
    .maybeSingle<Pick<GalleryRow, "image_url">>();
  if (error) return NextResponse.json({ error: "Failed to delete image." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const path = mediaPathFromUrl(data.image_url);
  if (path) await supabase.storage.from("media").remove([path]);

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
