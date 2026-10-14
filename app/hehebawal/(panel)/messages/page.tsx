"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Inbox, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import {
  Button,
  EmptyState,
  PageHeader,
  Segmented,
  SkeletonRows,
  errorMessage,
  panelClass,
  useConfirm,
  useToast,
} from "@/components/admin/ui";
import { SITE_TIME_ZONE } from "@/lib/site";

type Message = {
  form_id: number;
  fullname: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const shortDate = new Intl.DateTimeFormat("en-US", { timeZone: SITE_TIME_ZONE, month: "short", day: "numeric" });
const fullDate = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  dateStyle: "long",
  timeStyle: "short",
});

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const pendingRead = useRef(new Set<number>());
  const toast = useToast();
  const confirm = useConfirm();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't load messages."));
      const data = await res.json();
      setMessages(data.data ?? []);
      setLoadError("");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Couldn't load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const selected = messages.find((m) => m.form_id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const shown = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  const patchLocal = (id: number, isRead: boolean) =>
    setMessages((list) => list.map((m) => (m.form_id === id ? { ...m, is_read: isRead } : m)));

  /** Updates the list right away and rolls back if the server says no. */
  const setRead = async (id: number, isRead: boolean) => {
    if (pendingRead.current.has(id)) return;
    pendingRead.current.add(id);
    patchLocal(id, isRead);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: isRead }),
      });
      if (!res.ok) throw new Error(await errorMessage(res, "Couldn't update the message."));
    } catch (err) {
      patchLocal(id, !isRead);
      toast(err instanceof Error ? err.message : "Couldn't update the message.", "error");
    } finally {
      pendingRead.current.delete(id);
    }
  };

  const openMessage = (msg: Message) => {
    setSelectedId(msg.form_id);
    if (!msg.is_read) setRead(msg.form_id, true);
  };

  const handleDelete = async (msg: Message) => {
    const ok = await confirm({
      title: "Delete this message?",
      message: (
        <>
          The message from <strong className="font-semibold text-navy">{msg.fullname}</strong> will be
          removed for every admin. This can&apos;t be undone.
        </>
      ),
      confirmLabel: "Delete message",
      cancelLabel: "Keep message",
    });
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages?id=${msg.form_id}`, { method: "DELETE" });
      if (!res.ok) {
        toast(await errorMessage(res, "Couldn't delete the message. Try again."), "error");
        return;
      }
      setMessages((list) => list.filter((m) => m.form_id !== msg.form_id));
      setSelectedId(null);
      toast("Message deleted");
    } catch {
      toast("Couldn't reach the server. Check your connection and try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Sent through the contact form on the website. Replies go out from your own email."
      />

      <div className="mb-4">
        <Segmented
          label="Show messages"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: loading ? undefined : messages.length },
            { value: "unread", label: "Unread", count: loading ? undefined : unreadCount },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:h-[calc(100dvh-16rem)] lg:min-h-[28rem] lg:grid-cols-[22rem_minmax(0,1fr)]">
        {/* Inbox list (hidden on small screens while a message is open) */}
        <section
          aria-label="Inbox"
          className={`${panelClass} min-h-0 overflow-hidden lg:flex lg:flex-col ${selected ? "hidden lg:flex" : ""}`}
        >
          {loading ? (
            <SkeletonRows rows={4} />
          ) : loadError ? (
            <EmptyState
              icon={<Inbox size={22} />}
              title="Messages didn't load"
              body={loadError}
              action={<Button variant="secondary" onClick={() => { setLoading(true); fetchMessages(); }}>Try again</Button>}
            />
          ) : shown.length === 0 ? (
            <EmptyState
              icon={<Inbox size={22} />}
              title={filter === "unread" ? "You're all caught up" : "No messages yet"}
              body={
                filter === "unread"
                  ? "Every message has been read."
                  : "Messages from the contact form on the website will show up here."
              }
            />
          ) : (
            <ul className="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
              {shown.map((msg) => {
                const active = msg.form_id === selectedId;
                return (
                  <li key={msg.form_id}>
                    <button
                      type="button"
                      onClick={() => openMessage(msg)}
                      aria-current={active ? "true" : undefined}
                      className={`relative block w-full px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy sm:px-5 ${
                        active ? "bg-neon/25" : "hover:bg-zinc-50"
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={`flex min-w-0 items-center gap-2 truncate ${msg.is_read ? "font-medium text-zinc-700" : "font-extrabold text-navy"}`}>
                          {!msg.is_read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-navy">
                              <span className="sr-only">Unread: </span>
                            </span>
                          )}
                          <span className="truncate">{msg.fullname}</span>
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                          {msg.created_at ? shortDate.format(new Date(msg.created_at)) : ""}
                        </span>
                      </span>
                      <span className={`mt-0.5 block truncate text-sm ${msg.is_read ? "text-zinc-600" : "font-semibold text-navy"}`}>
                        {msg.subject}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-zinc-500">{msg.message}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Reading pane */}
        <section
          aria-label="Message"
          className={`${panelClass} min-h-0 flex-col overflow-hidden ${selected ? "flex" : "hidden lg:flex"}`}
        >
          {selected ? (
            <>
              <div className="border-b border-zinc-200 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="-ml-1 mb-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-zinc-600 hover:text-navy focus-visible:outline-2 focus-visible:outline-navy lg:hidden"
                >
                  <ArrowLeft size={16} aria-hidden="true" /> Back to inbox
                </button>
                <h2 className="text-xl leading-snug font-extrabold tracking-tight text-navy break-words sm:text-2xl">
                  {selected.subject}
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  <span className="font-semibold text-navy">{selected.fullname}</span>{" "}
                  <a href={`mailto:${selected.email}`} className="break-all underline-offset-2 hover:underline">
                    {selected.email}
                  </a>
                </p>
                {selected.created_at && (
                  <p className="mt-0.5 text-[13px] text-zinc-500">
                    Received {fullDate.format(new Date(selected.created_at))}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                    className="inline-flex h-10 items-center gap-2 rounded-control bg-neon px-4 text-sm font-bold text-navy transition-colors hover:bg-neon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                  >
                    <Reply size={16} aria-hidden="true" /> Reply by email
                  </a>
                  <Button variant="secondary" onClick={() => setRead(selected.form_id, !selected.is_read)}>
                    {selected.is_read ? <Mail size={16} aria-hidden="true" /> : <MailOpen size={16} aria-hidden="true" />}
                    {selected.is_read ? "Mark as unread" : "Mark as read"}
                  </Button>
                  <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" loading={deleting} onClick={() => handleDelete(selected)}>
                    {!deleting && <Trash2 size={16} aria-hidden="true" />} Delete
                  </Button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                <p className="max-w-prose text-[15px] leading-relaxed whitespace-pre-wrap break-words text-zinc-800">
                  {selected.message}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-zinc-500">
              <Mail size={36} className="text-zinc-300" aria-hidden="true" />
              <p className="text-sm">Choose a message to read it here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
