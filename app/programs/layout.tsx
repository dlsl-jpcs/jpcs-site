import Navbar from "@/components/Navbar";
import ClientFooter from "@/components/ClientFooter";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full relative selection:bg-neon selection:text-navy">
      <ScrollProgressBar />
      <Navbar />
      {children}
      <ClientFooter />
    </main>
  );
}
