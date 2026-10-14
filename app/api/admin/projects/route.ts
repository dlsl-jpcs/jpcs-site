import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin";
import { MAX_GALLERY_IMAGES, toProject } from "@/lib/projects";
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
  const gallery = Array.isArray(body.gallery)
    ? body.gallery.map(str).filter((u) => u !== "")
    : [];

  if (!name || name.length > 255) return { error: "Project name is required (max 255 characters)." };
  if (!description || description.length > 5000) return { error: "Description is required (max 5000 characters)." };
  if (!date || date.length > 255) return { error: "Date is required." };
  for (const url of [facebook, instagram]) {
    if (url && !isHttpUrl(url)) return { error: "Links must start with http:// or https://." };
  }
  if (image && !isAllowedImageUrl(image)) {
    return { error: "Image must be uploaded to storage or be a site-relative path like /image.png." };
  }
  if (gallery.length > MAX_GALLERY_IMAGES) {
    return { error: `A project can have at most ${MAX_GALLERY_IMAGES} extra photos besides its cover.` };
  }
  if (gallery.length > 0 && !image) {
    return { error: "Add a cover image before adding extra photos." };
  }
  if (gallery.some((u) => !isAllowedImageUrl(u))) {
    return { error: "Photos must be uploaded to storage or be a site-relative path like /image.png." };
  }

  return {
    image,
    gallery,
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

/**
 * Rewrites a project's photos from the form: the cover first (display_order 1),
 * then up to MAX_GALLERY_IMAGES extra photos. Stored files that are no longer used are deleted.
 */
async function syncImages(
  supabase: SupabaseClient,
  projectId: number,
  image: string | null,
  gallery: string[],
  alt: string,
) {
  const { data: existing, error } = await supabase
    .from("projects_and_events_images")
    .select("image_url")
    .eq("project_id", projectId)
    .returns<Pick<ProjectImageRow, "image_url">[]>();
  if (error) return error;

  const urls = image ? [image, ...gallery] : [];

  const { error: delError } = await supabase
    .from("projects_and_events_images")
    .delete()
    .eq("project_id", projectId);
  if (delError) return delError;

  if (urls.length > 0) {
    const { error: insError } = await supabase.from("projects_and_events_images").insert(
      urls.map((url, i) => ({
        project_id: projectId,
        image_url: url,
        alt_text: i === 0 ? alt : `${alt} photo ${i + 1}`,
        display_order: i + 1,
      })),
    );
    if (insError) return insError;
  }

  const removed = existing
    .map((i) => i.image_url)
    .filter((u) => !urls.includes(u))
    .map((u) => mediaPathFromUrl(u))
    .filter((p): p is string => !!p);
  if (removed.length) await supabase.storage.from("media").remove(removed);
  return null;
}

export async function GET() {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("projects_and_events")
    .select(SELECT)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .returns<ProjectRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });

  return NextResponse.json({ data: data.map(toProject) }, { status: 200 });
}

export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = parseProject(await req.json().catch(() => ({})));
  if (!parsed.row) return bad(parsed.error!);

  // New projects go to the top of the carousel; admins can move them from the list.
  const { data: first } = await supabase
    .from("projects_and_events")
    .select("display_order")
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle<{ display_order: number }>();

  const { data, error } = await supabase
    .from("projects_and_events")
    .insert({ ...parsed.row, display_order: (first?.display_order ?? 1) - 1 })
    .select("id")
    .single<{ id: number }>();
  if (error) return NextResponse.json({ error: "Failed to save project." }, { status: 500 });

  const imageError = await syncImages(supabase, data.id, parsed.image ?? null, parsed.gallery ?? [], parsed.row.project_name);
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

  const imageError = await syncImages(supabase, id, parsed.image ?? null, parsed.gallery ?? [], parsed.row.project_name);
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
