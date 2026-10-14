"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, CalendarPlus, FolderKanban, FolderPlus, Mail } from "lucide-react";
import { PageHeader, panelClass } from "@/components/admin/ui";
import { ADMIN_PATH } from "@/lib/adminPath";
import { eventStatus, formatEventRange, toStartsAt } from "@/lib/site";

type EventLite = { id: number; title: string; date: string; time: string; endDate: string; endTime: string };
type MessageLite = { form_id: number; fullname: string; subject: string; is_read: boolean };

type Overview = {
  events: EventLite[];
  projects: number;
  messages: MessageLite[];
};

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url);
  return (await res.json()).data ?? [];
}

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([
      getJson("/api/admin/events"),
      getJson("/api/admin/projects"),
      getJson("/api/admin/messages"),
    ])
      .then(([events, projects, messages]) =>
        setData({ events, projects: projects.length, messages }),
      )
      .catch(() => setFailed(true));
  }, []);

  const upcoming = (data?.events ?? [])
    .filter((e) => eventStatus(e) !== "past")
    .sort((a, b) => (toStartsAt(a.date, a.time) ?? "").localeCompare(toStartsAt(b.date, b.time) ?? ""));
  const unread = (data?.messages ?? []).filter((m) => !m.is_read).length;

  const when = (e: EventLite) => {
    const start = toStartsAt(e.date, e.time);
    return start ? formatEventRange(start, e.endDate ? toStartsAt(e.endDate, e.endTime || e.time) : null) : { date: e.date, time: e.time };
  };

  return (
    <div>
      <PageHeader title="Overview" description="What visitors see on the website right now." />

      {failed && (
        <p role="alert" className="mb-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Some numbers didn&apos;t load. Refresh the page to try again.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          href={`${ADMIN_PATH}/events`}
          label="Upcoming events"
          value={data ? upcoming.length : null}
          icon={<CalendarDays size={18} />}
          note={
            !data ? "" : upcoming[0] ? `Next: ${when(upcoming[0]).date}` : "Nothing on the calendar yet"
          }
        />
        <StatCard
          href={`${ADMIN_PATH}/projects`}
          label="Projects"
          value={data ? data.projects : null}
          icon={<FolderKanban size={18} />}
          note={data ? "In the Projects carousel" : ""}
        />
        <StatCard
          href={`${ADMIN_PATH}/messages`}
          label="Unread messages"
          value={data ? unread : null}
          icon={<Mail size={18} />}
          highlight={unread > 0}
          note={data ? `${data.messages.length} in the inbox` : ""}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <QuickLink href={`${ADMIN_PATH}/events?new`} icon={<CalendarPlus size={17} />}>
          Add event
        </QuickLink>
        <QuickLink href={`${ADMIN_PATH}/projects?new`} icon={<FolderPlus size={17} />}>
          Add project
        </QuickLink>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className={panelClass} aria-labelledby="coming-up">
          <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
            <h2 id="coming-up" className="font-bold text-navy">Coming up</h2>
            <Link href={`${ADMIN_PATH}/events`} className="rounded text-sm font-semibold text-zinc-500 hover:text-navy focus-visible:outline-2 focus-visible:outline-navy">
              All events
            </Link>
          </header>
          {!data ? (
            <ListSkeleton />
          ) : upcoming.length === 0 ? (
            <p className="px-5 py-6 text-sm text-zinc-500">No upcoming events. Add one so it shows on the home page.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {upcoming.slice(0, 4).map((e) => {
                const w = when(e);
                return (
                  <li key={e.id} className="flex items-baseline justify-between gap-4 px-5 py-3">
                    <span className="min-w-0 truncate font-semibold text-navy">{e.title}</span>
                    <span className="shrink-0 text-sm text-zinc-500">{w.date}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={panelClass} aria-labelledby="latest-messages">
          <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
            <h2 id="latest-messages" className="font-bold text-navy">Latest messages</h2>
            <Link href={`${ADMIN_PATH}/messages`} className="rounded text-sm font-semibold text-zinc-500 hover:text-navy focus-visible:outline-2 focus-visible:outline-navy">
              Open inbox
            </Link>
          </header>
          {!data ? (
            <ListSkeleton />
          ) : data.messages.length === 0 ? (
            <p className="px-5 py-6 text-sm text-zinc-500">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {data.messages.slice(0, 4).map((m) => (
                <li key={m.form_id} className="flex items-center gap-3 px-5 py-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? "bg-transparent" : "bg-navy"}`}>
                    {!m.is_read && <span className="sr-only">Unread</span>}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className={m.is_read ? "font-medium text-zinc-700" : "font-bold text-navy"}>{m.fullname}</span>
                    <span className="ml-2 text-sm text-zinc-500">{m.subject}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  href,
  label,
  value,
  icon,
  note,
  highlight = false,
}: {
  href: string;
  label: string;
  value: number | null;
  icon: ReactNode;
  note: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-panel border p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
        highlight ? "border-neon bg-neon" : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${highlight ? "text-navy" : "text-zinc-500"}`}>{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-control ${
            highlight ? "bg-navy text-neon" : "bg-zinc-100 text-zinc-500 group-hover:text-navy"
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-4xl leading-none font-extrabold tracking-tight text-navy tabular-nums">
        {value ?? <span className="inline-block h-9 w-12 animate-pulse rounded bg-zinc-200 align-middle" />}
      </p>
      <p className={`mt-2 min-h-5 truncate text-sm ${highlight ? "text-navy/70" : "text-zinc-500"}`}>{note}</p>
    </Link>
  );
}

function QuickLink({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center gap-2 rounded-control border border-zinc-300 bg-white px-4 text-sm font-bold text-navy transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      <span aria-hidden="true" className="text-zinc-500">{icon}</span>
      {children}
    </Link>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3 px-5 py-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-4 animate-pulse rounded bg-zinc-100" style={{ width: `${80 - i * 15}%` }} />
      ))}
    </div>
  );
}
