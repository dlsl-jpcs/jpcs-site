import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-figtree items-center justify-items-center min-h-screen w-full">
     <Navbar />
     <Hero />
    </div>
  );
}
