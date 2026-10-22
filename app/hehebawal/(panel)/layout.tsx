"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  // Image as ImageIcon, // toggle once gallery ready
  Mail,
  Users,
  Bot,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { ADMIN_PATH } from "@/lib/adminPath";
import { AdminProviders } from "@/components/admin/ui";

const NAV = [
  { href: ADMIN_PATH, icon: LayoutDashboard, label: "Overview" },
  { href: `${ADMIN_PATH}/events`, icon: CalendarDays, label: "Events" },
  { href: `${ADMIN_PATH}/projects`, icon: FolderKanban, label: "Projects" },
  { href: `${ADMIN_PATH}/officers`, icon: Users, label: "Officers" },
  { href: `${ADMIN_PATH}/chatbot`, icon: Bot, label: "Chatbot" },
  // { href: `${ADMIN_PATH}/gallery`, icon: ImageIcon, label: "Gallery" }, // toggle once gallery ready
  { href: `${ADMIN_PATH}/messages`, icon: Mail, label: "Messages" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer after navigating.
  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <AdminProviders>
      <div className="min-h-dvh bg-off-white text-navy selection:bg-neon selection:text-navy lg:flex">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-navy px-4 text-white lg:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="admin-nav"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-control text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-neon"
          >
            <Menu size={22} />
          </button>
        </header>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-navy/60 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          id="admin-nav"
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy text-white transition-[transform,visibility] duration-200 lg:visible lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
            drawerOpen ? "visible translate-x-0" : "invisible -translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between px-5 lg:h-20">
            <Brand />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-control text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-neon lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav aria-label="Admin" className="mt-2 flex-1 space-y-1 px-3">
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = href === ADMIN_PATH ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-control px-3 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon ${
                    active ? "bg-neon text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-1 border-t border-white/10 px-3 py-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-3 rounded-control px-3 text-[15px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-neon"
            >
              <ExternalLink size={19} aria-hidden="true" />
              View website
            </a>
            <LogoutButton />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">{children}</div>
        </main>
      </div>
    </AdminProviders>
  );
}

function Brand() {
  return (
    <Link
      href={ADMIN_PATH}
      className="flex items-center gap-2.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
    >
      <span className="rounded-full bg-white p-0.5">
        <Image src="/jpcslogo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        JPCS Admin<span className="text-neon">.</span>
      </span>
    </Link>
  );
}

function LogoutButton() {
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    await fetch("/api/admin/auth", { method: "DELETE" }).catch(() => null);
    // Full page load so no admin page stays in the client router cache.
    window.location.assign("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className="flex h-11 w-full items-center gap-3 rounded-control px-3 text-[15px] font-semibold text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-neon disabled:opacity-60"
    >
      <LogOut size={19} aria-hidden="true" />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
