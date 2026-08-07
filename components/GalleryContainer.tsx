"use client";

import Image from "next/image";
import { useState } from "react";

export default function GalleryContainer() {
  const images = Array.from({ length: 45 }, (_, index) => ({
    id: index + 1,
    src: "/officers/ALVAREZ.jpg",
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
        bg-[#0B132B]
        p-4 sm:p-8 lg:p-20
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
          sm:grid-cols-5
          gap-2 sm:gap-4
        "
      >
        {currentImages.map((image) => (
          <div
            key={image.id}
            className="
              bg-amber-200
              w-full
              aspect-square
              p-1 sm:p-2
              overflow-hidden
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
              "
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 sm:gap-6 mt-6 sm:mt-10">
          <button
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
            className="
              px-3 py-2 sm:px-5
              bg-white
              text-[#0B132B]
              rounded-md
              font-semibold
              text-sm sm:text-base
              disabled:opacity-30
              disabled:cursor-not-allowed
              hover:bg-gray-200
              transition
            "
          >
            Previous
          </button>

          <span className="text-white font-medium text-sm sm:text-base">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
            className="
              px-3 py-2 sm:px-5
              bg-white
              text-[#0B132B]
              rounded-md
              font-semibold
              text-sm sm:text-base
              disabled:opacity-30
              disabled:cursor-not-allowed
              hover:bg-gray-200
              transition
            "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
