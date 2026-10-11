import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import type { ContactRow } from "@/types/database";

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });

export async function GET() {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("contact_form")
    .select("id, fullname, email, subject, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .returns<ContactRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });

  // The admin inbox keys messages by form_id.
  return NextResponse.json({ data: data.map((row) => ({ ...row, form_id: row.id })) }, { status: 200 });
}

export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id) || typeof body.is_read !== "boolean") return bad("Invalid request");

  const { data, error } = await supabase
    .from("contact_form")
    .update({ is_read: body.is_read })
    .eq("id", id)
    .select("id, fullname, email, subject, message, is_read, created_at")
    .maybeSingle<ContactRow>();
  if (error) return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: [{ ...data, form_id: data.id }] }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const params = new URL(req.url).searchParams;
  const id = Number(params.get("form_id") ?? params.get("id"));
  if (!Number.isInteger(id)) return bad("Missing ID");

  const { data, error } = await supabase
    .from("contact_form")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: number }>();
  if (error) return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
