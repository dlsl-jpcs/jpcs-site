import Banner from "@/components/Banner";
import Contact from "@/components/Contact";
import ClientFooter from "@/components/ClientFooter";
import Hero from "@/components/Hero";
import LazySections from "../components/LazySections";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function Home() {
  return (
    <main className="w-full relative selection:bg-neon selection:text-navy">
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <Banner />
      <LazySections />
      <Contact />
      <ClientFooter />
    </main>
  );
}
