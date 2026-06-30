import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Banner from "@/components/Banner";
import Contact from "@/components/Contact";
import ClientFooter from "@/components/ClientFooter";
import Hero from "@/components/Hero";
import LazySections from "../components/LazySections";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: ContactForm } = await supabase.from("ContactForm").select();

  ContactForm?.map((item) => {
    // TESTING PURPOSES
    console.log(item.fullname);
  });

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
