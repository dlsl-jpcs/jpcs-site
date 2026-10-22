import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hashIp } from "@/lib/ipHash";
import { str } from "@/lib/validation";
import { CHAT_LINKS, getKnowledge } from "@/lib/chat/knowledge";
import { llmAnswer, type ChatTurn } from "@/lib/chat/provider";
import { searchAnswer, type ChatAnswer } from "@/lib/chat/search";

const MAX_CHARS = 500;
const MAX_TURNS = 6;
const ALLOWED_LINKS = new Set(CHAT_LINKS.map((l) => l.href));

const NOT_SURE =
  "I'm not sure about that one. Want to send your question to the JPCS officers? They'll reply by email.";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const turns: ChatTurn[] = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-MAX_TURNS)
    .map((m: { role?: unknown; content?: unknown }) => ({
      role: m?.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: str(m?.content).slice(0, MAX_CHARS),
    }))
    .filter((t: ChatTurn) => t.content);

  const question = turns.at(-1);
  if (!question || question.role !== "user") {
    return NextResponse.json({ message: "Ask a question first." }, { status: 400 });
  }

  // Check the per-IP limit before spending free-tier quota; the insert trigger enforces it too.
  const supabase = await createClient();
  const ipHash = hashIp(req);
  const { data: rateOk } = await supabase.rpc("chat_rate_ok", { p_ip_hash: ipHash });
  if (rateOk === false) {
    return NextResponse.json(
      { message: "You've asked a lot of questions in a short time. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const knowledge = await getKnowledge();

  let answer: ChatAnswer | null = null;
  let source: "llm" | "search" | "none" = "llm";
  try {
    answer = await llmAnswer(knowledge.text, turns);
  } catch (err) {
    if (process.env.GEMINI_API_KEY) console.warn("chat LLM failed, using search:", (err as Error).message);
    source = "search";
    answer = await searchAnswer(question.content, knowledge, supabase);
  }
  if (!answer) {
    source = "none";
    answer = { reply: NOT_SURE, links: [], handoff: true };
  }

  const links = [...new Set(answer.links)]
    .filter((href) => ALLOWED_LINKS.has(href))
    .slice(0, 3)
    .map((href) => CHAT_LINKS.find((l) => l.href === href)!);

  const { error } = await supabase.from("chat_questions").insert({
    question: question.content,
    source,
    unanswered: answer.handoff,
    ip_hash: ipHash,
  });
  if (error && !error.message.includes("rate_limited")) {
    console.error("chat_questions insert failed:", error.message);
  }

  return NextResponse.json({ reply: answer.reply, links, handoff: answer.handoff, source }, { status: 200 });
}
