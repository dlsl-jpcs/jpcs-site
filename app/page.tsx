import Banner from "@/components/Banner";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar"; 

export default function Home() {
  return (
    <div className="font-figtree items-center justify-items-center min-h-screen w-full">
      <ScrollProgressBar /> 
      <Navbar />
      <Hero />
      <Banner />
    </div>
  );
}
