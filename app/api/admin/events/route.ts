import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { splitStartsAt, toStartsAt } from "@/lib/site";
import { isAllowedImageUrl, isHttpUrl, mediaPathFromUrl, optStr, str } from "@/lib/validation";
import type { UpcomingEventRow } from "@/types/database";

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });

function toAdminEvent(row: UpcomingEventRow) {
  return {
    id: row.id,
    title: row.event_name,
    org: row.organization_names,
    ...splitStartsAt(row.starts_at),
    ...(row.ends_at
      ? (({ date, time }) => ({ endDate: date, endTime: time }))(splitStartsAt(row.ends_at))
      : { endDate: "", endTime: "" }),
    location: row.event_location ?? "",
    description: row.event_description,
    link: row.registration_link ?? "",
    image: row.image_url ?? "",
    facebook: row.facebook_link ?? "",
    instagram: row.instagram_link ?? "",
  };
}

/** Whitelists and validates the admin form fields; unknown keys in the body are ignored. */
function parseEvent(body: Record<string, unknown>) {
  const title = str(body.title);
  const description = str(body.description);
  const startsAt = toStartsAt(str(body.date), str(body.time));
  const endDate = str(body.endDate);
  const endTime = str(body.endTime);
  const endsAt = endDate ? toStartsAt(endDate, endTime || str(body.time)) : null;
  const link = optStr(body.link);
  const facebook = optStr(body.facebook);
  const instagram = optStr(body.instagram);
  const image = optStr(body.image);
  const location = optStr(body.location);

  if (!title || title.length > 255) return { error: "Title is required (max 255 characters)." };
  if (!description || description.length > 5000) return { error: "Description is required (max 5000 characters)." };
  if (!startsAt) return { error: "A valid date and time are required." };
  if (endDate && !endsAt) return { error: "The end date and time are not valid." };
  if (endsAt && startsAt && new Date(endsAt) < new Date(startsAt)) {
    return { error: "The event cannot end before it starts." };
  }
  for (const url of [link, facebook, instagram]) {
    if (url && !isHttpUrl(url)) return { error: "Links must start with http:// or https://." };
  }
  if (image && !isAllowedImageUrl(image)) {
    return { error: "Image must be uploaded to storage or be a site-relative path like /image.png." };
  }

  return {
    row: {
      event_name: title,
      organization_names: str(body.org) || "JPCS",
      starts_at: startsAt,
      ends_at: endsAt,
      event_location: location,
      event_description: description,
      registration_link: link,
      facebook_link: facebook,
      instagram_link: instagram,
      image_url: image,
    },
  };
}

export async function GET() {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("upcoming_events")
    .select("*")
    .order("starts_at", { ascending: false })
    .returns<UpcomingEventRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load events." }, { status: 500 });

  return NextResponse.json({ data: data.map(toAdminEvent) }, { status: 200 });
}

export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = parseEvent(await req.json().catch(() => ({})));
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from("upcoming_events")
    .insert(parsed.row)
    .select()
    .single<UpcomingEventRow>();
  if (error) return NextResponse.json({ error: "Failed to save event." }, { status: 500 });

  return NextResponse.json({ data: [toAdminEvent(data)] }, { status: 201 });
}

export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id)) return bad("Missing ID");

  const parsed = parseEvent(body);
  if (!parsed.row) return bad(parsed.error!);

  const { data: before } = await supabase
    .from("upcoming_events")
    .select("image_url")
    .eq("id", id)
    .maybeSingle<Pick<UpcomingEventRow, "image_url">>();

  const { data, error } = await supabase
    .from("upcoming_events")
    .update(parsed.row)
    .eq("id", id)
    .select()
    .maybeSingle<UpcomingEventRow>();
  if (error) return NextResponse.json({ error: "Failed to save event." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // The image was replaced or cleared: remove the old file from Storage.
  if (before?.image_url && before.image_url !== data.image_url) {
    const oldPath = mediaPathFromUrl(before.image_url);
    if (oldPath) await supabase.storage.from("media").remove([oldPath]);
  }

  return NextResponse.json({ data: [toAdminEvent(data)] }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return bad("Missing ID");

  const { data, error } = await supabase
    .from("upcoming_events")
    .delete()
    .eq("id", id)
    .select("image_url")
    .maybeSingle<Pick<UpcomingEventRow, "image_url">>();
  if (error) return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const path = mediaPathFromUrl(data.image_url);
  if (path) await supabase.storage.from("media").remove([path]);

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
