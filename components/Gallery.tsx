//toggle once gallery ready

// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { ArrowRight } from "lucide-react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import Image from "next/image";

// import { GalleryMainImages } from "@/types/galleryMainImages";

// export default function Gallery() {
//   const router = useRouter();
//   const [images, setImages] = useState<GalleryMainImages[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Autoplay pauses while hovered or focused, and is skipped entirely for
//   // visitors who ask for reduced motion.
//   const autoplayPlugins = useMemo(
//     () =>
//       typeof window !== "undefined" &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches
//         ? []
//         : [
//             Autoplay({
//               delay: 4000,
//               stopOnInteraction: false,
//               stopOnMouseEnter: true,
//               stopOnFocusIn: true,
//             }),
//           ],
//     [],
//   );

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true },
//     autoplayPlugins,
//   );

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

//   const scrollTo = useCallback(
//     (index: number) => emblaApi?.scrollTo(index),
//     [emblaApi],
//   );

//   const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
//     setSelectedIndex(api.selectedScrollSnap());
//   }, []);

//   useEffect(() => {
//     if (!emblaApi) return;

//     setScrollSnaps(emblaApi.scrollSnapList());
//     onSelect(emblaApi);

//     emblaApi.on("select", onSelect);
//     emblaApi.on("reInit", () => {
//       setScrollSnaps(emblaApi.scrollSnapList());
//       onSelect(emblaApi);
//     });

//     return () => {
//       emblaApi.off("select", onSelect);
//     };
//   }, [emblaApi, onSelect]);

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await fetch("/api/galleryMain");
//         if (!response.ok) throw new Error("Failed to load gallery");
//         const data = await response.json();
//         setImages(data.data ?? []);
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchImages();
//   }, []);

//   const displayImages = images.map((image) => ({
//     id: image.id,
//     image_url: image.image_url,
//     alt_text: image.alt_text,
//     display_order: image.display_order,
//   }));

//   return (
//     <section
//       id="gallery"
//       className="relative
//     w-full
//     min-h-[800px]
//     bg-navy
//     px-6
//     pt-6
//     pb-16
//     -mt-[200px]
//     sm:mt-0
//     md:px-16
//     md:py-24"
//     >
//       <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
//         {/* Carousel */}
//         <motion.div
//           initial={{ opacity: 0, x: -30 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="relative order-2 w-full min-w-0 max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[800px] h-[380px] sm:h-[430px] md:h-[480px] lg:h-[535px] mx-auto md:order-1"
//           role="region"
//           aria-roledescription="carousel"
//           aria-label="JPCS photo highlights"
//         >
//           <div ref={emblaRef} className="h-full w-full overflow-hidden">
//             <div className="flex h-full">
//               {isLoading ? (
//                 <div
//                   role="status"
//                   className="relative w-full h-full shrink-0 grow-0 basis-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:rounded-3xl md:rounded-[2rem] flex items-center justify-center text-white/60"
//                 >
//                   Loading photos...
//                 </div>
//               ) : displayImages.length === 0 ? (
//                 <div className="relative w-full h-full shrink-0 grow-0 basis-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:rounded-3xl md:rounded-[2rem] flex items-center justify-center px-6 text-center text-white/60">
//                   No photos yet. Check back soon!
//                 </div>
//               ) : (
//                 displayImages.map((image, index) => (
//                   <div
//                     key={image.id}
//                     role="group"
//                     aria-roledescription="slide"
//                     aria-label={`${index + 1} of ${displayImages.length}`}
//                     className="relative w-full h-full shrink-0 grow-0 basis-full"
//                   >
//                     <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0D1522] sm:rounded-3xl md:rounded-[2rem]">
//                       <Image
//                         src={image.image_url || "/jpcslogo.png"}
//                         alt={
//                           image.alt_text ||
//                           `JPCS photo ${index + 1} of ${displayImages.length}`
//                         }
//                         fill
//                         className="object-cover"
//                         sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 420px, 800px"
//                         priority={index === 0}
//                       />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Pagination */}
//           {!isLoading && displayImages.length > 0 && (
//             <div className="mt-5 flex items-center justify-center rounded-full bg-[#13213b] px-2 py-0.5 w-fit max-w-full mx-auto">
//               {scrollSnaps.map((_, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => scrollTo(index)}
//                   aria-label={`Go to image ${index + 1}`}
//                   aria-current={index === selectedIndex}
//                   className="group flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-neon"
//                 >
//                   <span
//                     className={`h-2 w-2 rounded-full border-2 transition-all duration-250 group-hover:border-white ${
//                       index === selectedIndex
//                         ? "bg-white border-white"
//                         : "bg-transparent border-[#7d8597]"
//                     }`}
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         {/* Copy block */}
//         <motion.div
//           initial={{ opacity: 0, x: 30 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="order-1 flex w-full flex-col items-center gap-3 text-center md:order-2 md:w-2/5 md:items-start md:text-left"
//         >
//           <h2 className="text-5xl font-extrabold leading-tight text-white md:text-6xl">
//             JPCS
//           </h2>
//           <span className="inline-block rounded-full -rotate-2 bg-[#d4ff4f] px-6 py-2 text-4xl font-extrabold leading-tight text-[#0a0e1a] md:text-5xl">
//             Gallery
//           </span>

//           <button
//             onClick={() => router.push("/gallery")}
//             type="button"
//             className="mt-4 flex items-center gap-3 rounded-full py-1 pr-3 text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon"
//           >
//             <span
//               className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30"
//               aria-hidden="true"
//             >
//               <ArrowRight className="h-4 w-4" />
//             </span>
//             Explore more
//           </button>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
