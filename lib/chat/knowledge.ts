import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { programs } from "@/data/programs";
import { ABOUT_INTRO, CONTACT_INFO, MISSION, VISION_ITEMS } from "@/data/about";
import { categoryLabel, toOfficer, type Officer } from "@/lib/officers";
import { formatEventRange, startOfTodayISO } from "@/lib/site";
import type { ChatFaqRow, OfficerRow, ProjectRow, UpcomingEventRow } from "@/types/database";

/** The only links the bot may hand out (validated server-side against this list). */
export const CHAT_LINKS: { href: string; label: string }[] = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About JPCS" },
  { href: "/#programs", label: "Programs" },
  { href: "/#projects", label: "Projects" },
  { href: "/#gallery", label: "Gallery highlights" },
  { href: "/#contact", label: "Contact us" },
  { href: "/gallery", label: "Full gallery" },
  ...programs.map((p) => ({ href: `/programs/${p.slug}`, label: `${p.short} program` })),
];

export type ChatEvent = { title: string; date: string; time: string; location: string; link: string };

export type Knowledge = {
  /** Markdown pack sent to the LLM as the system context. */
  text: string;
  events: ChatEvent[];
  officers: Officer[];
};

const TTL_MS = 5 * 60 * 1000;
let cached: { at: number; value: Knowledge } | null = null;

/**
 * Everything the site knows, as one compact doc. Context stuffing instead of retrieval: the
 * whole pack is a few thousand tokens. Cached for TTL_MS, so admin edits show up within minutes.
 */
export async function getKnowledge(): Promise<Knowledge> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
  const { value, complete } = await buildKnowledge();
  // A pack built while Supabase was erroring is partial; don't pin it for the full TTL.
  if (complete) cached = { at: Date.now(), value };
  return value;
}

/** Drop the cached pack so the next question sees an admin's FAQ edit right away. */
export function invalidateKnowledge() {
  cached = null;
}

async function buildKnowledge(): Promise<{ value: Knowledge; complete: boolean }> {
  // Cookieless anon client: public data only, same RLS view as a logged-out visitor.
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const [eventsRes, projectsRes, officersRes, faqRes] = await Promise.all([
    supabase
      .from("upcoming_events")
      .select("*")
      .or(`starts_at.gte.${startOfTodayISO()},ends_at.gte.${startOfTodayISO()}`)
      .order("starts_at", { ascending: true })
      .limit(10)
      .returns<UpcomingEventRow[]>(),
    supabase
      .from("projects_and_events")
      .select("*")
      .order("display_order", { ascending: true })
      .limit(20)
      .returns<ProjectRow[]>(),
    supabase
      .from("officers")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: true })
      .returns<OfficerRow[]>(),
    supabase
      .from("chat_faq")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .returns<ChatFaqRow[]>(),
  ]);

  let complete = true;
  for (const [name, res] of Object.entries({ eventsRes, projectsRes, officersRes, faqRes })) {
    if (res.error) {
      complete = false;
      console.error(`chat knowledge: ${name} failed:`, res.error.message);
    }
  }

  const events: ChatEvent[] = (eventsRes.data ?? []).map((row) => ({
    title: row.event_name,
    ...formatEventRange(row.starts_at, row.ends_at),
    location: row.event_location ?? "",
    link: row.registration_link ?? "",
  }));
  const officers = (officersRes.data ?? []).map(toOfficer);
  const projects = projectsRes.data ?? [];
  const faqs = faqRes.data ?? [];

  const plain = (s: string) => s.replace(/\*\*/g, "");
  const lines: string[] = [];

  lines.push("# JPCS DLSL (Junior Philippine Computer Society, De La Salle Lipa)");
  lines.push(...ABOUT_INTRO);
  lines.push(`Mission: ${MISSION}`);
  lines.push(`Vision: ${VISION_ITEMS.map((v) => `${v.title}: ${v.description}`).join(" ")}`);
  lines.push(
    `Contact: email ${CONTACT_INFO.email}; Facebook ${CONTACT_INFO.facebook}; Instagram ${CONTACT_INFO.instagram}; address De La Salle Lipa, ${CONTACT_INFO.address}. Visitors can also message the officers through the contact form (/#contact).`,
  );

  lines.push("", "## Upcoming events");
  if (events.length === 0) lines.push("No upcoming events are posted right now.");
  for (const e of events) {
    lines.push(
      `- ${e.title}: ${e.date}, ${e.time}${e.location ? `, at ${e.location}` : ""}${e.link ? `. Registration: ${e.link}` : ""}`,
    );
  }
  for (const row of eventsRes.data ?? []) {
    lines.push(`  ${row.event_name} details: ${row.event_description}`);
  }

  lines.push("", "## Past projects and events (shown in /#projects)");
  for (const p of projects) {
    lines.push(`- ${p.project_name} (${p.project_date}): ${p.project_description}`);
  }

  lines.push("", "## Officers");
  for (const o of officers) {
    lines.push(`- ${o.name}: ${o.position} (${categoryLabel(o.category)}), ${o.year} ${o.course}`);
  }

  lines.push("", "## Degree programs under JPCS (shown in /#programs)");
  for (const p of programs) {
    lines.push(
      `### ${p.short}: ${p.title} (link /programs/${p.slug})`,
      `${p.tagline} ${p.duration}, ${p.degree}, accredited by ${p.accreditation}.`,
      plain(p.overviewParagraphs.join(" ")),
      `Curriculum includes: ${[...new Set(p.curriculum)].join(", ")}.`,
      `Careers: ${p.careers.map((c) => c.name).join(", ")}.`,
    );
  }

  if (faqs.length) {
    lines.push("", "## FAQ (written by the officers)");
    for (const f of faqs) lines.push(`Q: ${f.question}`, `A: ${f.answer}`);
  }

  lines.push("", "## Links you may use", ...CHAT_LINKS.map((l) => `- ${l.href}: ${l.label}`));

  return { value: { text: lines.join("\n"), events, officers }, complete };
}
