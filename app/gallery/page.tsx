import GalleryHeader from "@/components/GalleryHeader";
import GalleryBanner from "@/components/GalleryBanner";
import GalleryContainer from "@/components/GalleryContainer";
import ClientFooter from "@/components/ClientFooter";

export default function GalleryPage() {
  return (
    <main className="w-full relative min-h-screen overflow-auto m-0 p-0">
      <GalleryHeader />
      <GalleryBanner />
      <GalleryContainer />
      <ClientFooter />
    </main>
  );
}
