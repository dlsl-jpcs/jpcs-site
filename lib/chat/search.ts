import type { SupabaseClient } from "@supabase/supabase-js";
import { programs } from "@/data/programs";
import { CONTACT_INFO } from "@/data/about";
import type { Knowledge } from "@/lib/chat/knowledge";

export type ChatAnswer = { reply: string; links: string[]; handoff: boolean };

const has = (q: string, words: string[]) => words.some((w) => new RegExp(`\\b${w}`, "i").test(q));

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

  const program = programs.find((p) => has(q, [p.slug, p.short.toLowerCase()]));
  if (program) {
    return {
      reply: `${program.short} (${program.title}): ${program.tagline} It's a ${program.duration.toLowerCase()} ${program.degree}.`,
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
          reply: "No upcoming events are posted right now. Follow JPCS on Facebook for announcements.",
          links: ["/#contact"],
          handoff: false,
        };
  }

  if (has(q, ["officer", "president", "vice", "secretary", "treasurer", "auditor", "head", "rep"])) {
    const byPosition = knowledge.officers.filter((o) =>
      o.position
        .toLowerCase()
        .split(/\W+/)
        .some((word) => word.length > 3 && q.includes(word)),
    );
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

  const { data, error } = await supabase.rpc("search_chat_faq", { q: question });
  if (error) console.error("search_chat_faq failed:", error.message);
  const top = (data as { answer: string }[] | null)?.[0];
  if (top) return { reply: top.answer, links: [], handoff: false };

  if (has(q, ["contact", "email", "reach", "facebook", "instagram", "message"])) {
    return {
      reply: `You can email ${CONTACT_INFO.email}, message JPCS on Facebook, or use the contact form.`,
      links: ["/#contact"],
      handoff: false,
    };
  }

  return null;
}
