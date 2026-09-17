import Banner from "@/components/Banner";
import Contact from "@/components/Contact";
import ClientFooter from "@/components/ClientFooter";
import Hero from "@/components/Hero";
import LazySections from "../components/LazySections";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ProjectsEvents from "@/components/ProjectsEvents";
import Gallery from "@/components/Gallery";
import HashScrollHandler from "@/components/HashScrollHandler";
import Officers from "@/components/officers/Officers";

export default async function Home() {
  return (
    <main className="w-full relative selection:bg-neon selection:text-navy">
      <HashScrollHandler />
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <Banner />
      <LazySections />
      <ProjectsEvents />
      <Gallery />
      <Officers />
      <Contact />
      <ClientFooter />
    </main>
  );
}
