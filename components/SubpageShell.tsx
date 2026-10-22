import Navbar from "@/components/Navbar";
import ClientFooter from "@/components/ClientFooter";
import ScrollProgressBar from "@/components/ScrollProgressBar";

/**
 * The chrome every public page outside the home page shares: scroll bar, full navigation and the
 * footer, so program pages, the calendar and the error pages all feel like the same site.
 * The footer's rounded top overlaps the last section by 2.5rem, so end each page with padding.
 */
export default function SubpageShell({ children, className = "bg-navy" }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={`w-full relative selection:bg-neon selection:text-navy ${className}`}>
      <ScrollProgressBar />
      <Navbar />
      {children}
      <div className="[&>footer]:shadow-none">
        <ClientFooter />
      </div>
    </main>
  );
}
