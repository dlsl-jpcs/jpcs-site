import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

const MAX_OFFICERS = 500;

// Saves the officers order. Body: { ids: number[] } with officer ids, first = shown first.
// Applied in one database call (reorder_officers), so the order is never half-saved.
export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > MAX_OFFICERS ||
    !ids.every((id) => Number.isInteger(id) && id > 0) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ error: "Send each officer id once, in the order to show." }, { status: 400 });
  }

  const { error } = await supabase.rpc("reorder_officers", { ids });
  if (error) {
    console.error("reorder_officers failed:", error.message);
    return NextResponse.json({ error: "Couldn't save the order." }, { status: 500 });
  }

  return NextResponse.json({ message: "Order saved" }, { status: 200 });
}
