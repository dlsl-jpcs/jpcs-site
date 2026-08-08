"use client";

import Image from "next/image";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function GalleryHeader() {
  const router = useRouter();

  return (
    <>
      <div className="absolute bg-[#090e1f] inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>
      <div className="flex flex-col w-full h-screen relative">
        <div className="relative flex w-full items-center gap-3 px-4 py-4 sm:px-10 sm:py-6">
          <Image src="/jpcslogo.png" alt="jpcslogo" width={60} height={60} />
          <h1 className="text-2xl sm:text-3xl font-bold">JPCS</h1>
        </div>
        <div className="relative w-full px-4 pb-8 sm:px-10 sm:pb-12">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm sm:text-base font-medium mb-6"
          >
            <KeyboardBackspaceIcon />
            <span>Back to Home</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex flex-row gap-4 sm:flex-row sm:items-end sm:flex-wrap">
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold">
                JPCS
              </span>
              <span className="inline-flex items-center rounded-3xl bg-[#C4FF4D1F] px-4 py-2 text-xs sm:text-sm font-bold text-[#C4FF4D] border border-[#C4FF4D33] rotate-3">
                67 items
              </span>
            </div>
            <div>
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#C4FF4D]">
                GALLERY
              </span>
            </div>
            <div>
              <span className="block max-w-full sm:max-w-[640px] text-sm sm:text-base leading-7 text-[#9CA3AF]">
                Step into the moments that define JPCS—from exciting events and
                activities to the memories we create together.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
