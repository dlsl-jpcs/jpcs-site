import GalleryHeader from "@/components/GalleryHeader";
import GalleryBanner from "@/components/GalleryBanner";
import GalleryContainer from "@/components/GalleryContainer";

export default function GalleryPage() {
  return (
    <main className="w-full relative h-screen overflow-auto m-0 p-0">
      <GalleryHeader />
      <GalleryBanner />
      <GalleryContainer />
    </main>
  );
}
