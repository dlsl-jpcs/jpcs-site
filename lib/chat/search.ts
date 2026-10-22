import type { SupabaseClient } from "@supabase/supabase-js";
import { programs } from "@/data/programs";
import { CONTACT_INFO } from "@/data/about";
import type { Knowledge } from "@/lib/chat/knowledge";

export type ChatAnswer = { reply: string; links: string[]; handoff: boolean };

const has = (q: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}`, "i").test(q));

const FAQ_CLOSE_MATCH = 0.5;

const wordSet = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .map((w) => (w.length > 3 ? w.replace(/s$/, "") : w)),
  );

// Jaccard overlap (shared words / all words), stopwords included so "how to be an officer" is far from "who are the officers".
function similarity(a: string, b: string) {
  const wa = wordSet(a);
  const wb = wordSet(b);
  const shared = [...wa].filter((w) => wb.has(w)).length;
  return shared / (wa.size + wb.size - shared || 1);
}

/**
 * No-LLM answers: a few templated intents over live data, then the officers' FAQ via full-text
 * search. Used when no API key is set, the free quota is spent, or the provider is down.
 * Returns null when nothing matches.
 */
export async function searchAnswer(
  question: string,
  knowledge: Knowledge,
  supabase: SupabaseClient,
): Promise<ChatAnswer | null> {
  const q = question.toLowerCase();

  if (/^\s*(hi|hello|hey|yo|good (morning|afternoon|evening)|sup)\b[\s!.?]*$/.test(q)) {
    return {
      reply: "Hi, I'm Judy! 🦥 I can help with JPCS events, officers, programs and how to reach us. What would you like to know?",
      links: [],
      handoff: false,
    };
  }

  // An FAQ the officers wrote for nearly this exact question beats the generic templates below,
  // which would otherwise grab it on a keyword like "officer".
  const { data, error } = await supabase.rpc("search_chat_faq", { q: question });
  if (error) console.error("search_chat_faq failed:", error.message);
  const faqs = (data as { question: string; answer: string }[] | null) ?? [];
  const close = faqs.find((f) => similarity(q, f.question) >= FAQ_CLOSE_MATCH);
  if (close) return { reply: close.answer, links: [], handoff: false };

  const program = programs.find((p) => has(q, [p.slug, p.short.toLowerCase()]));
  if (program) {
    return {
      reply: `${program.short} (${program.title}): ${program.tagline} ${program.degree}, ${program.duration.toLowerCase()}.`,
      links: [`/programs/${program.slug}`],
      handoff: false,
    };
  }

  if (has(q, ["event", "upcoming", "next", "schedule", "activit", "happening"])) {
    const events = knowledge.events.slice(0, 3);
    return events.length
      ? {
          reply: `Coming up:\n${events
            .map((e) => `• ${e.title}: ${e.date}, ${e.time}${e.location ? ` at ${e.location}` : ""}`)
            .join("\n")}`,
          links: ["/#home"],
          handoff: false,
        }
      : {
          reply: "No upcoming events are posted right now, but follow JPCS on Facebook so you don't miss the next one!",
          links: ["/#contact"],
          handoff: false,
        };
  }

  if (has(q, ["officer", "president", "vice", "secretary", "treasurer", "auditor", "head", "rep"])) {
    // "president" alone shouldn't also pull in every Vice/Assistant President.
    const byPosition = knowledge.officers.filter((o) => {
      const words = o.position.toLowerCase().split(/\W+/);
      const modifiers = ["vice", "assistant", "deputy"];
      if (modifiers.some((m) => words.includes(m) !== has(q, [m]))) return false;
      // Generic words ("officers", "head") would match every title; they fall through to the board.
      return words.some((w) => w.length > 3 && !["officer", "head", "representative"].includes(w) && has(q, [w]));
    });
    const list = (byPosition.length ? byPosition : knowledge.officers.filter((o) => o.category === "executive")).slice(0, 5);
    if (list.length) {
      return {
        reply: list.map((o) => `• ${o.name}: ${o.position}`).join("\n"),
        links: ["/#about"],
        handoff: false,
      };
    }
  }

  if (has(q, ["program", "course", "degree", "track"])) {
    return {
      reply: `JPCS covers ${programs.map((p) => `${p.short} (${p.title})`).join(", ")}.`,
      links: ["/#programs", ...programs.map((p) => `/programs/${p.slug}`)],
      handoff: false,
    };
  }

  if (faqs[0]) return { reply: faqs[0].answer, links: [], handoff: false };

  if (has(q, ["contact", "email", "reach", "facebook", "instagram", "message"])) {
    return {
      reply: `You can email ${CONTACT_INFO.email}, message JPCS on Facebook, or use the contact form.`,
      links: ["/#contact"],
      handoff: false,
    };
  }

  return null;
}
