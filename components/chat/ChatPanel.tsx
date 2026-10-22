"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Send, X } from "lucide-react";
import { useModalA11y } from "@/lib/useModalA11y";
import BotAvatar from "@/components/chat/BotAvatar";

type Msg = {
  role: "user" | "assistant";
  content: string;
  links?: { href: string; label: string }[];
  handoff?: boolean;
  error?: boolean;
};

const STORAGE_KEY = "jpcs-chat";
const MAX_CHARS = 500;
const QUICK_REPLIES = ["What's the next event?", "What programs are under JPCS?", "How do I join?", "Who are the officers?"];

function loadHistory(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Msg[]) : [];
  } catch {
    return [];
  }
}

/** True on phones, where the panel becomes a full-screen sheet and behaves like a modal. */
function useIsSheet() {
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setSheet(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return sheet;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>(loadHistory);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [handoffFor, setHandoffFor] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isSheet = useIsSheet();

  useModalA11y(isSheet, panelRef);

  useEffect(() => {
    if (!isSheet) inputRef.current?.focus({ preventScroll: true });
  }, [isSheet]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // Storage blocked (private mode); the chat just won't survive a reload.
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, handoffFor]);

  useEffect(() => {
    // Only when focus is in the chat, so Escape in another modal (e.g. event details) leaves it open.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelRef.current?.contains(document.activeElement)) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function ask(text: string) {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || pending) return;
    const history = [...messages.filter((m) => !m.error), { role: "user" as const, content: question }];
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setHandoffFor(null);
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.message ?? "Oops, I tripped over a branch! Please try again.", error: true },
        ]);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply, links: data.links, handoff: data.handoff }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I can't reach the server right now. Check your connection and I'll be right here when you try again!", error: true },
      ]);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  const lastUserQuestion = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  return (
    <motion.div
      ref={panelRef}
      id="jpcs-chat-panel"
      role="dialog"
      aria-modal={isSheet}
      aria-label="Chat with Judy"
      tabIndex={-1}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed z-[60] flex flex-col overflow-hidden bg-charcoal-light text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] outline-none inset-0 sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(600px,calc(100dvh-8rem))] sm:w-[380px] sm:rounded-3xl sm:border sm:border-white/10 origin-bottom-right"
    >
      <header className="flex items-center gap-3 border-b border-white/10 bg-navy px-4 py-3">
        <BotAvatar size={36} />
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">Judy</p>
          <p className="text-xs text-white/50">JPCS&apos;s happy sloth · ask me anything</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-neon"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-4">
            <Bubble role="assistant">
              Hi, I&apos;m Judy, the JPCS sloth! 🦥 I may move slow, but I know a lot about our events, programs, officers, and how to get involved. What are you curious about?
            </Bubble>
            <div className="flex flex-wrap gap-2 pl-10">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="rounded-full border border-neon/40 px-3 py-1.5 text-xs font-semibold text-neon transition-colors hover:bg-neon hover:text-navy focus-visible:outline-2 focus-visible:outline-neon"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            <Bubble role={m.role} error={m.error}>
              {m.content}
            </Bubble>
            {!!m.links?.length && (
              <div className="flex flex-wrap gap-2 pl-10">
                {m.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => isSheet && onClose()}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neon hover:text-navy focus-visible:outline-2 focus-visible:outline-neon"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            )}
            {m.handoff && i === messages.length - 1 && handoffFor === null && (
              <div className="pl-10">
                <button
                  type="button"
                  onClick={() => setHandoffFor(lastUserQuestion)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neon px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:bg-neon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
                >
                  <Send className="h-3.5 w-3.5" /> Ask the officers
                </button>
              </div>
            )}
          </div>
        ))}

        {pending && (
          <div className="flex items-end gap-2" aria-label="Judy is typing">
            <BotAvatar size={32} />
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white/5 px-4 py-3">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-white/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}

        {handoffFor !== null && <HandoffForm question={handoffFor} onDone={() => setHandoffFor(null)} />}
      </div>

      <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
        <div className="flex items-end gap-2 rounded-2xl bg-white/5 p-1.5 focus-within:ring-2 focus-within:ring-neon/60">
          <label htmlFor="jpcs-chat-input" className="sr-only">
            Your question
          </label>
          <textarea
            ref={inputRef}
            id="jpcs-chat-input"
            data-autofocus
            rows={1}
            maxLength={MAX_CHARS}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(input);
              }
            }}
            placeholder="Ask Judy about events, programs…"
            className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-white placeholder:text-white/40 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || pending}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon text-navy transition-opacity disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-neon"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.6} />
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-white/40">Answers can be wrong. Don&apos;t share personal info.</p>
      </form>
    </motion.div>
  );
}

function Bubble({ role, error, children }: { role: Msg["role"]; error?: boolean; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-line break-words rounded-2xl rounded-br-md bg-neon px-4 py-2.5 text-sm font-medium text-navy">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <BotAvatar size={32} />
      <p
        className={`max-w-[85%] whitespace-pre-line break-words rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed ${
          error ? "bg-red-500/15 text-red-200" : "bg-white/5 text-white/90"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

/** Sends the question to the existing contact inbox (/api/contact keeps its honeypot + rate limit). */
function HandoffForm({ question, onDone }: { question: string; onDone: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: question, website: "" });
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" | "error"; text?: string }>({ kind: "idle" });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: "Question from the website chatbot" }),
      });
      const data = await res.json().catch(() => ({}));
      setStatus(res.ok ? { kind: "sent" } : { kind: "error", text: data.message ?? "Couldn't send. Try again." });
    } catch {
      setStatus({ kind: "error", text: "Couldn't reach the server. Try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <Bubble role="assistant">Yay, sent! 🎉 An officer will reply to {form.email} as soon as they can.</Bubble>
    );
  }

  const field =
    "w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-neon/60";

  return (
    <form onSubmit={submit} className="ml-10 space-y-2 rounded-2xl border border-white/10 bg-navy/60 p-3">
      <p className="text-xs font-semibold text-white/70">Send this to the JPCS officers</p>
      <input aria-label="Your name" required maxLength={255} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
      <input aria-label="Your email" required type="email" maxLength={255} placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
      <textarea aria-label="Your question" required rows={3} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${field} resize-none`} />
      {/* Honeypot, hidden from people; see Contact.tsx. */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" />
      {status.kind === "error" && <p className="text-xs text-red-300">{status.text}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white">
          Cancel
        </button>
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="rounded-xl bg-neon px-3 py-1.5 text-xs font-bold text-navy hover:bg-neon-hover disabled:opacity-50"
        >
          {status.kind === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
