"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { ADMIN_PATH } from "@/lib/adminPath";
import BotAvatar from "@/components/chat/BotAvatar";

// The panel (messages, form, fetch logic) only downloads when someone first opens the chat.
const loadPanel = () => import("@/components/chat/ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith(ADMIN_PATH)) return null;

  return (
    <>
      <AnimatePresence>{open && <ChatPanel onClose={() => setOpen(false)} />}</AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        aria-expanded={open}
        aria-controls="jpcs-chat-panel"
        aria-label={open ? "Close chat" : "Ask JPCS a question"}
        className={`fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl bg-neon text-navy shadow-[0_12px_30px_-8px_rgba(196,255,71,0.55)] transition-transform duration-200 hover:scale-105 hover:bg-neon-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        {open ? <X className="h-6 w-6" strokeWidth={2.6} /> : <BotAvatar size={40} plain />}
      </button>
    </>
  );
}
