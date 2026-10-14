"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { ADMIN_PATH } from "@/lib/adminPath";
import { useSingleFlight } from "@/lib/useSingleFlight";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [signingIn, runSignIn] = useSingleFlight();
  // Stays true after a successful sign-in while the dashboard loads.
  const [redirecting, setRedirecting] = useState(false);
  const busy = signingIn || redirecting;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (redirecting) return;
    runSignIn(async () => {
      setError("");
      try {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          setRedirecting(true);
          // A full page load, not router.push: the client router may still hold a cached
          // "redirect to login" for the dashboard from before the session cookie existed.
          window.location.assign(ADMIN_PATH);
          return;
        }
        if (res.status === 401) {
          setError("That email and password don't match an admin account.");
        } else {
          const data = await res.json().catch(() => null);
          setError(data?.message || "Couldn't sign in. Try again in a moment.");
        }
      } catch {
        setError("Couldn't reach the server. Check your connection and try again.");
      }
    });
  };

  const fieldClass =
    "block w-full h-12 rounded-control border border-zinc-300 bg-white px-3.5 text-[15px] text-navy placeholder:text-zinc-400 transition-colors hover:border-zinc-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15";

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_100%)]"
      />

      <div className="relative w-full max-w-[25rem]">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="rounded-full bg-white p-1 shadow-[0_0_40px_rgba(196,255,71,0.18)]">
            <Image src="/jpcslogo.png" alt="JPCS" width={64} height={64} className="h-16 w-16 rounded-full" priority />
          </span>
          <h1 className="mt-5 text-[1.75rem] leading-tight font-extrabold tracking-tight text-white">
            Sign in to JPCS Admin
          </h1>
          <p className="mt-1.5 text-[15px] text-white/60">Manage events, projects and messages.</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-panel bg-white p-6 text-navy shadow-2xl sm:p-7">
          {error && (
            <p role="alert" className="mb-5 rounded-control border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@dlsl.edu.ph"
          />

          <label htmlFor="admin-password" className="mb-1.5 mt-4 block text-sm font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-1 my-auto flex h-10 w-10 items-center justify-center rounded-control text-zinc-500 hover:text-navy focus-visible:outline-2 focus-visible:outline-navy"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={busy}
            aria-busy={busy || undefined}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-control bg-neon text-[15px] font-extrabold text-navy transition-colors hover:bg-neon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
            {redirecting ? "Opening dashboard…" : signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="rounded text-sm font-semibold text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon"
          >
            Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
