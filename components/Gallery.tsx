"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { GalleryMainImages } from "@/types/galleryMainImages";

export default function Gallery() {
  const [images, setImages] = useState<GalleryMainImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("api/galleryMain");
        const data = await response.json();
        setImages(data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const displayImages = images.map((image) => ({
    id: image.id,
    image_url: image.image_url,
    display_order: image.display_order,
  }));

  return (
    <section
      id="gallery"
      className={`relative w-full min-h-[800px] bg-navy px-6 pt-6 pb-16 md:px-16 md:py-24`}
    >
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
        {/* Carousel */}
        <div className="relative order-2 w-[280px] sm:w-[340px] md:w-[420px] lg:w-[800px] h-[380px] sm:h-[430px] md:h-[480px] lg:h-[535px] mx-auto md:order-1">
          <Swiper
            loop={true}
            modules={[Pagination]}
            pagination={{
              el: ".custom-pagination",
              clickable: true,
            }}
            className="relative h-full w-full"
          >
            {isLoading ? (
              <SwiperSlide>
                <div className="relative w-full h-full overflow-hidden rounded-2xl border sm:rounded-3xl md:rounded-[2rem]">
                  Loading Images...
                </div>
              </SwiperSlide>
            ) : displayImages.length === 0 ? (
              <SwiperSlide>
                <div className="relative w-full h-full overflow-hidden rounded-2xl border sm:rounded-3xl md:rounded-[2rem]">
                  there are no images as of the moment...
                </div>
              </SwiperSlide>
            ) : (
              displayImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="relative w-full h-full overflow-hidden rounded-2xl border sm:rounded-3xl md:rounded-[2rem]">
                    <div
                      className="absolute inset-0 bg-center flex items-end bg-cover"
                      style={{
                        backgroundImage: `url('${image.image_url}')`,
                      }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
          <div className="custom-pagination mt-4 flex justify-center" />
        </div>
        {/* Copy block */}
        <div className="order-1 flex w-full flex-col items-center gap-3 text-center md:order-2 md:w-2/5 md:items-start md:text-left">
          <h2 className="text-5xl font-extrabold leading-tight text-white md:text-6xl">
            JPCS
          </h2>
          <span className="inline-block rounded-full -rotate-2 bg-[#d4ff4f] px-6 py-2 text-4xl font-extrabold leading-tight text-[#0a0e1a] md:text-5xl">
            Gallery
          </span>

          <button
            type="button"
            className="mt-4 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30">
              <ArrowRight className="h-4 w-4" />
            </span>
            Explore more
          </button>
        </div>
      </div>
      <style jsx global>
        {`
          .custom-pagination {
            position: static !important;
            width: fit-content !important;
            left: auto !important;
            right: auto !important;
            transform: none !important;

            display: flex;
            justify-content: center;
            align-items: center;

            margin: 20px auto 0;

            padding: 12px 18px;
            gap: 10px;

            background: #13213b;
            border-radius: 9999px;
          }

          .custom-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;

            margin: 0 !important;

            border: 2px solid #7d8597;
            background: transparent;
            opacity: 1;

            transition: all 0.25s ease;
          }

          .custom-pagination .swiper-pagination-bullet-active {
            background: white;
            border-color: white;
          }
        `}
      </style>
    </section>
  );
}
