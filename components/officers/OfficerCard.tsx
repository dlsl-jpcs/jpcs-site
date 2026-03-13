"use client";
import Image from "next/image";

interface OfficerCardProps {
  name: string;
  nickname: string | string[];
  image: string;
  position: string;
  year: string;
  course: string;
}

export default function OfficerCard({
  name,
  image,
  position,
  year,
  course,
}: OfficerCardProps) {
  const courseShort =
    course === "BS Information Technology"
      ? "BSIT"
      : course === "BS Computer Science"
        ? "BSCS"
        : "ACT";

  return (
    <div className="group relative w-[260px] md:w-[300px] aspect-[4/5] rounded-[2rem] overflow-hidden bg-charcoal-light border border-white/5 hover:border-neon/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(196,255,71,0.15)] cursor-pointer select-none">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 260px, 300px"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute top-5 right-5 z-10">
        <span className="inline-block px-4 py-1.5 text-[11px] font-extrabold tracking-widest text-navy bg-neon rounded-full shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {courseShort} • {year}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
       
        <div className="w-8 h-1.5 bg-neon rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />

        <h4 className="text-white font-extrabold text-2xl leading-tight mb-1">
          {name}
        </h4>
        <p className="text-white/60 font-medium text-sm leading-snug line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
          {position}
        </p>
      </div>
    </div>
  );
}
