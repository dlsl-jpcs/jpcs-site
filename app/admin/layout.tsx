"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  Image as ImageIcon,
  Mail,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full">
              <img
                src="/jpcslogo.png"
                alt="JPCS"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Admin<span className="text-neon">.</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem
            href="/admin/events"
            icon={<CalendarDays size={20} />}
            label="Events"
          />
          <NavItem
            href="/admin/projects"
            icon={<FolderKanban size={20} />}
            label="Projects"
          />
          <NavItem
            href="/admin/gallery"
            icon={<ImageIcon size={20} />}
            label="Gallery"
          />
          <NavItem
            href="/admin/messages"
            icon={<Mail size={20} />}
            label="Messages"
          />
        </nav>

        <div className="p-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden text-gray-900">
        <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">JPCS Dashboard</h2>
        </header>
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
    >
      <LogOut size={20} />
      <span className="font-medium">Logout</span>
    </button>
  );
}
