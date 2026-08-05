"use client";

import Image from "next/image";

export default function GalleryHeader() {
  return (
    <>
      <div className="absolute bg-[#0B132B] inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>
      <div className="flex flex-col w-full h-full">
        <div className="relative flex w-full h-full pl-10 pt-10">
          <Image src="/jpcslogo.png" alt="jpcslogo" width={60} height={60} />
          <h1 className="text-3xl font-bold self-center pl-3">JPCS</h1>
        </div>
        <div className="relative w-full h-full pl-20 pt-3">
          <button className="flex">
            <Image
              src="/leftButton.png"
              alt="leftbutton"
              width={25}
              height={20}
            />
            <span className="pl-3">Back to Home</span>
          </button>
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
            <span className="inline-block w-[500px] text-[#9CA3AF]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-full relative justify-center gap-6 items-center flex flex-col md:flex-row z-[2]">
        <div className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] mr-1">
          <img
            src="/button1.png"
            className="w-full h-full object-cover object-[50%_20%] shrink-0 rounded-full"
          />
        </div>
        <div className="bg-amber-400 w-[600px] h-[500px] ml-20">
          <div className="bg-red-200 w-full h-[20px]"></div>
          <p className="bg-blue-500">Hello</p>
        </div>
      </div>
    </>
  );
}
