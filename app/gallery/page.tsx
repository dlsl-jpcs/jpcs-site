"use client";

import GalleryHeader from "@/components/GalleryHeader";
import GalleryBanner from "@/components/GalleryBanner";
import GalleryContainer from "@/components/GalleryContainer";
import ClientFooter from "@/components/ClientFooter";
import { useState } from "react";

export default function GalleryPage() {
  const [imageCount, setImageCount] = useState(0);

  return (
    <main className="w-full relative min-h-screen overflow-auto m-0 p-0">
      <GalleryHeader imageCount={imageCount} />
      <GalleryBanner />
      <GalleryContainer setImageCount={setImageCount} />
      <ClientFooter />
    </main>
  );
}
