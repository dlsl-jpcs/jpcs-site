import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin";
import { toProject } from "@/lib/projects";
import { isAllowedImageUrl, isHttpUrl, mediaPathFromUrl, optStr, str } from "@/lib/validation";
import type { ProjectImageRow, ProjectRow } from "@/types/database";

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });
const SELECT = "*, projects_and_events_images(id, image_url, display_order)";

function parseProject(body: Record<string, unknown>) {
  const name = str(body.name);
  const description = str(body.description);
  const date = str(body.date);
  const facebook = optStr(body.facebook);
  const instagram = optStr(body.instagram);
  const image = optStr(body.image);

  if (!name || name.length > 255) return { error: "Project name is required (max 255 characters)." };
  if (!description || description.length > 5000) return { error: "Description is required (max 5000 characters)." };
  if (!date || date.length > 255) return { error: "Date is required." };
  for (const url of [facebook, instagram]) {
    if (url && !isHttpUrl(url)) return { error: "Links must start with http:// or https://." };
  }
  if (image && !isAllowedImageUrl(image)) {
    return { error: "Image must be uploaded to storage or be a site-relative path like /image.png." };
  }

  return {
    image,
    row: {
      project_name: name,
      project_description: description,
      project_date: date,
      organization_names: str(body.org) || "JPCS",
      facebook_link: facebook,
      instagram_link: instagram,
    },
  };
}

/** Keeps the project's cover image (lowest display_order) in sync with the single "image" form field. */
async function syncCover(supabase: SupabaseClient, projectId: number, image: string | null, alt: string) {
  const { data: existing, error } = await supabase
    .from("projects_and_events_images")
    .select("id, image_url, display_order")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true })
    .limit(1)
    .returns<Pick<ProjectImageRow, "id" | "image_url" | "display_order">[]>();
  if (error) return error;

  const cover = existing[0];
  if (image) {
    const result = cover
      ? await supabase
          .from("projects_and_events_images")
          .update({ image_url: image, alt_text: alt })
          .eq("id", cover.id)
      : await supabase
          .from("projects_and_events_images")
          .insert({ project_id: projectId, image_url: image, alt_text: alt, display_order: 1 });
    if (result.error) return result.error;
  } else if (cover) {
    const { error: delError } = await supabase
      .from("projects_and_events_images")
      .delete()
      .eq("id", cover.id);
    if (delError) return delError;
  }

  if (cover && cover.image_url !== image) {
    const oldPath = mediaPathFromUrl(cover.image_url);
    if (oldPath) await supabase.storage.from("media").remove([oldPath]);
  }
  return null;
}

export async function GET() {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("projects_and_events")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .returns<ProjectRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });

  return NextResponse.json({ data: data.map(toProject) }, { status: 200 });
}

export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = parseProject(await req.json().catch(() => ({})));
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from("projects_and_events")
    .insert(parsed.row)
    .select("id")
    .single<{ id: number }>();
  if (error) return NextResponse.json({ error: "Failed to save project." }, { status: 500 });

  const imageError = await syncCover(supabase, data.id, parsed.image ?? null, parsed.row.project_name);
  if (imageError) {
    // Don't leave a half-created project behind.
    await supabase.from("projects_and_events").delete().eq("id", data.id);
    return NextResponse.json({ error: "Failed to save project image." }, { status: 500 });
  }

  const { data: full } = await supabase
    .from("projects_and_events")
    .select(SELECT)
    .eq("id", data.id)
    .single<ProjectRow>();
  return NextResponse.json({ data: full ? [toProject(full)] : [] }, { status: 201 });
}

export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id)) return bad("Missing ID");

  const parsed = parseProject(body);
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from("projects_and_events")
    .update(parsed.row)
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: number }>();
  if (error) return NextResponse.json({ error: "Failed to save project." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const imageError = await syncCover(supabase, id, parsed.image ?? null, parsed.row.project_name);
  if (imageError) return NextResponse.json({ error: "Failed to save project image." }, { status: 500 });

  const { data: full } = await supabase
    .from("projects_and_events")
    .select(SELECT)
    .eq("id", id)
    .single<ProjectRow>();
  return NextResponse.json({ data: full ? [toProject(full)] : [] }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return bad("Missing ID");

  // Collect stored files first; the image rows disappear with the project (ON DELETE CASCADE).
  const { data: images } = await supabase
    .from("projects_and_events_images")
    .select("image_url")
    .eq("project_id", id)
    .returns<Pick<ProjectImageRow, "image_url">[]>();

  const { data, error } = await supabase
    .from("projects_and_events")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: number }>();
  if (error) return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const paths = (images ?? []).map((i) => mediaPathFromUrl(i.image_url)).filter((p): p is string => !!p);
  if (paths.length) await supabase.storage.from("media").remove(paths);

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
