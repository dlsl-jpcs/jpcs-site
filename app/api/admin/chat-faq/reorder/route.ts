import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { invalidateKnowledge } from "@/lib/chat/knowledge";

const MAX_FAQS = 500;

// Saves the FAQ order. Body: { ids: number[] } with FAQ ids, first = shown first.
// Applied in one database call (reorder_chat_faq), so the order is never half-saved.
export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > MAX_FAQS ||
    !ids.every((id) => Number.isInteger(id) && id > 0) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ error: "Send each FAQ id once, in the order to show." }, { status: 400 });
  }

  const { error } = await supabase.rpc("reorder_chat_faq", { ids });
  if (error) {
    console.error("reorder_chat_faq failed:", error.message);
    return NextResponse.json({ error: "Couldn't save the order." }, { status: 500 });
  }

  invalidateKnowledge();
  return NextResponse.json({ message: "Order saved" }, { status: 200 });
}
