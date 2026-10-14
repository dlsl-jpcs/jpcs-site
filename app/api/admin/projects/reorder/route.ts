import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

const MAX_PROJECTS = 500;

// Saves the carousel order. Body: { ids: number[] } with project ids, first = shown first.
// Applied in one database call (reorder_projects), so the order is never half-saved.
export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > MAX_PROJECTS ||
    !ids.every((id) => Number.isInteger(id) && id > 0) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ error: "Send each project id once, in the order to show." }, { status: 400 });
  }

  const { error } = await supabase.rpc("reorder_projects", { ids });
  if (error) {
    console.error("reorder_projects failed:", error.message);
    return NextResponse.json({ error: "Couldn't save the order." }, { status: 500 });
  }

  return NextResponse.json({ message: "Order saved" }, { status: 200 });
}
