import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import type { ChatQuestionRow } from "@/types/database";

const PAGE_SIZE = 200;
const MAX_DELETE = 500;

// Newest questions visitors asked the chatbot. ?filter=unanswered keeps only the ones it couldn't answer.
export async function GET(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  let query = supabase
    .from("chat_questions")
    .select("id, question, source, unanswered, created_at")
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);
  if (new URL(req.url).searchParams.get("filter") === "unanswered") query = query.eq("unanswered", true);

  const { data, error } = await query.returns<ChatQuestionRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load questions." }, { status: 500 });

  return NextResponse.json({ data }, { status: 200 });
}

// Body: { ids: number[] }.
export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_DELETE || !ids.every((id) => Number.isInteger(id) && id > 0)) {
    return NextResponse.json({ error: "Send the ids to delete." }, { status: 400 });
  }

  const { error } = await supabase.from("chat_questions").delete().in("id", ids);
  if (error) return NextResponse.json({ error: "Failed to delete questions." }, { status: 500 });

  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
