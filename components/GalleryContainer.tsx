"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import GalleryModal from "./GalleryModal";

interface GalleryImage {
  id: number;
  alt: string;
  src: string;
}

interface GalleryContainerProps {
  setImageCount: (count: number) => void;
}

export default function GalleryContainer({
  setImageCount,
}: GalleryContainerProps) {
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
        setImageCount(data.data.length);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Couldn't load the gallery. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [setImageCount]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const desktopImagesPerPage = 20;
  const mobileImagesPerPage = 10;
  const imagesPerPage = desktopImagesPerPage;

  const gridTopRef = useRef<HTMLDivElement>(null);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  return (
    <div
      ref={gridTopRef}
      className="
        bg-[#0D172F]
        p-4 sm:p-6 lg:p-12
        flex flex-col
        w-full
        relative
        scroll-mt-4
      "
    >
      <div
        aria-hidden="true"
        className="
          absolute inset-0 pointer-events-none
          bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]
          bg-[size:4rem_4rem]
          [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]
        "
      />

      {isLoading && (
        <div role="status" className="relative flex justify-center items-center py-20">
          <span className="text-white/60 text-sm">Loading gallery…</span>
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className="relative flex justify-center items-center py-20">
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {!isLoading && !error && images.length === 0 && (
        <div className="relative flex justify-center items-center py-20">
          <span className="text-white/60 text-sm">No photos yet. Check back soon!</span>
        </div>
      )}

      {!isLoading && !error && images.length > 0 && (
        <ul
          className="
            relative
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-5
            gap-3
            sm:gap-4
          "
        >
          {currentImages.map((image, index) => (
            <motion.li
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.05 }}
              key={image.id}
              className="list-none"
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(startIndex + index)}
                aria-label={`View photo: ${image.alt}`}
                className="
                  group
                  relative
                  block
                  w-full
                  aspect-[4/3]
                  overflow-hidden
                  rounded-xl
                  bg-[#111B33]
                  ring-1 ring-white/10
                  transition-shadow
                  duration-300
                  hover:ring-neon/50
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-neon
                  cursor-pointer
                "
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  className="
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                    motion-reduce:transition-none
                    motion-reduce:group-hover:scale-100
                  "
                />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Gallery pages"
          className="relative flex justify-center items-center gap-3 sm:gap-6 mt-6 sm:mt-10 mb-10"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/10"
          >
            <NavigateBeforeIcon />
          </button>

          <span
            className="text-white font-medium text-sm sm:text-base tabular-nums"
            aria-live="polite"
          >
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/10"
          >
            <NavigateNextIcon />
          </button>
        </nav>
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
