import Navbar from "@/components/Navbar";
import ClientFooter from "@/components/ClientFooter";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full relative bg-off-white selection:bg-neon selection:text-navy">
      <ScrollProgressBar />
      <Navbar />
      {children}
      <div className="[&>footer]:shadow-none">
        <ClientFooter />
      </div>
    </main>
  );
}
