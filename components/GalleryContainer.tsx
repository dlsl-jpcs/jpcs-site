"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export default function GalleryContainer() {
  const images = Array.from({ length: 45 }, (_, index) => ({
    id: index + 1,
    src: "/officers/DE-VILLA.jpg",
    alt: `ALVAREZ ${index + 1}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);

  // Desktop: 20 images
  // Mobile: 10 images
  const desktopImagesPerPage = 20;
  const mobileImagesPerPage = 10;

  // For now, use 20 per page
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
      {/* Gallery */}
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
        {currentImages.map((image) => (
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
            "
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={300}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 sm:gap-6 mt-6 sm:mt-10">
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
    </div>
  );
}
