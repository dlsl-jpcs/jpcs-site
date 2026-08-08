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
      <div className="flex flex-col w-full h-full relative">
        <div className="relative flex w-full h-[100px] pl-10 pt-10">
          <Image src="/jpcslogo.png" alt="jpcslogo" width={60} height={60} />
          <h1 className="text-3xl font-bold self-center pl-3">JPCS</h1>
        </div>
        <div className="relative w-full h-full pl-20 pt-3">
          <button
            onClick={() => router.push("/")}
            className="flex cursor-pointer mb-10"
          >
            <KeyboardBackspaceIcon />
            <span className="pl-3">Back to Home</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="">
              <span className="text-8xl font-bold pr-6">JPCS</span>
              <span className="relative top-[-10] inline-block bg-[#C4FF4D1F] pr-[15px] pl-[15px] pt-[5px] pb-[5px] rounded-3xl border-[#C4FF4D33] border-1 rotate-5 [word-spacing:5px] text-[#C4FF4D] font-bold">
                67 items
              </span>
            </div>
            <div>
              <span className="text-8xl font-extrabold text-[#C4FF4D]">
                GALLERY
              </span>
            </div>
            <div>
              <span className="pt-8 inline-block w-[500px] text-[#9CA3AF]">
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
