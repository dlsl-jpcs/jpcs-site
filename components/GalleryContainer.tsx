"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import GalleryModal from "./GalleryModal";

interface GalleryImage {
  id: number;
  alt: string;
  src: string;
}

export default function GalleryContainer() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/gallery");
        if (!response.ok) throw new Error("Failed to load gallery images");
        const data = await response.json();
        setImages(data.data);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Couldn't load the gallery. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const desktopImagesPerPage = 20;
  const mobileImagesPerPage = 10;
  const imagesPerPage = desktopImagesPerPage;

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  return (
    <div
      className="
        bg-[#0D172F]
        p-4 sm:p-6 lg:p-12
        flex flex-col
        w-full
        relative
        bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]
        bg-[size:4rem_4rem]
        [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]
      "
    >
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <span className="text-white/60 text-sm">Loading gallery…</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex justify-center items-center py-20">
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="flex justify-center items-center py-20">
          <span className="text-white/60 text-sm">No images found.</span>
        </div>
      )}

      {!isLoading && !error && images.length > 0 && (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-5
            gap-2
            sm:gap-4
          "
        >
          {currentImages.map((image, index) => (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              key={image.id}
              className="
                w-full
                aspect-square
                p-1
                overflow-hidden
                rounded-[10px]
                cursor-pointer
              "
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={300}
                onClick={() => setSelectedIndex(startIndex + index)}
                className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-105
                  transition-transform
                  duration-300
                  rounded-[10px]
                "
              />
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 sm:gap-6 mt-6 sm:mt-10 mb-10">
          <button
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
          >
            <NavigateBeforeIcon />
          </button>

          <span className="text-white font-medium text-sm sm:text-base">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
          >
            <NavigateNextIcon />
          </button>
        </div>
      )}

      <GalleryModal
        images={images}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onNext={() =>
          setSelectedIndex((i) => (i === null ? 0 : (i + 1) % images.length))
        }
        onPrev={() =>
          setSelectedIndex((i) =>
            i === null ? 0 : (i - 1 + images.length) % images.length,
          )
        }
      />
    </div>
  );
}
