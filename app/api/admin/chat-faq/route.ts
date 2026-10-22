import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { invalidateKnowledge } from "@/lib/chat/knowledge";
import { toFaq } from "@/lib/chatFaq";
import { optStr, str } from "@/lib/validation";
import type { ChatFaqRow } from "@/types/database";

const bad = (message: string) => NextResponse.json({ error: message }, { status: 400 });

/** Whitelists and validates the admin form fields; unknown keys in the body are ignored. */
function parseFaq(body: Record<string, unknown>) {
  const question = str(body.question);
  const answer = str(body.answer);
  const keywords = optStr(body.keywords);

  if (!question || question.length > 300) return { error: "Question is required (max 300 characters)." };
  if (!answer || answer.length > 2000) return { error: "Answer is required (max 2000 characters)." };
  if (keywords && keywords.length > 300) return { error: "Keywords can be up to 300 characters." };

  return { row: { question, answer, keywords, is_active: body.active !== false } };
}

export async function GET() {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const { data, error } = await supabase
    .from("chat_faq")
    .select("*")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })
    .returns<ChatFaqRow[]>();
  if (error) return NextResponse.json({ error: "Failed to load FAQs." }, { status: 500 });

  return NextResponse.json({ data: data.map(toFaq) }, { status: 200 });
}

export async function POST(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const parsed = parseFaq(await req.json().catch(() => ({})));
  if (!parsed.row) return bad(parsed.error!);

  const { data: last } = await supabase
    .from("chat_faq")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ display_order: number }>();

  const { data, error } = await supabase
    .from("chat_faq")
    .insert({ ...parsed.row, display_order: (last?.display_order ?? 0) + 1 })
    .select()
    .single<ChatFaqRow>();
  if (error) return NextResponse.json({ error: "Failed to save FAQ." }, { status: 500 });

  invalidateKnowledge();
  return NextResponse.json({ data: [toFaq(data)] }, { status: 201 });
}

export async function PUT(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id)) return bad("Missing ID");

  const parsed = parseFaq(body);
  if (!parsed.row) return bad(parsed.error!);

  const { data, error } = await supabase
    .from("chat_faq")
    .update(parsed.row)
    .eq("id", id)
    .select()
    .maybeSingle<ChatFaqRow>();
  if (error) return NextResponse.json({ error: "Failed to save FAQ." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  invalidateKnowledge();
  return NextResponse.json({ data: [toFaq(data)] }, { status: 200 });
}

export async function DELETE(req: Request) {
  const { supabase, error: authError } = await requireAdmin();
  if (authError) return authError;

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return bad("Missing ID");

  const { data, error } = await supabase.from("chat_faq").delete().eq("id", id).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to delete FAQ." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  invalidateKnowledge();
  return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
}
