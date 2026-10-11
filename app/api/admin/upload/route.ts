import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin";

const MAX_BYTES = 5 * 1024 * 1024; // keep in sync with the bucket's file_size_limit
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const FOLDERS = ["events", "projects", "gallery"];

// Admin-only image upload into the public "media" bucket; returns the public URL to store in image_url.
export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folderField = form?.get("folder");
  const folder = typeof folderField === "string" && FOLDERS.includes(folderField) ? folderField : "gallery";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = EXTENSIONS[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF or AVIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  const path = `${folder}/${randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("storage upload failed:", error.message);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
