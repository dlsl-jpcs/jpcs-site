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

export default function OfficerCard({ name, image, position, year, course }: OfficerCardProps) {
  const courseShort =
    course === "BS Information Technology" ? "BSIT" :
    course === "BS Computer Science" ? "BSCS" : "ACT";

  return (
    <div className="group relative rounded-xl overflow-hidden bg-[#0d0d0d] border border-white/[0.07] hover:border-light-green/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(13,204,88,0.08)] cursor-default select-none">

      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/10 to-transparent" />

        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-white/60 bg-black/50 backdrop-blur-sm border border-white/10 rounded-md px-2 py-0.5">
          {courseShort}
        </span>
      </div>

      {/* Info */}
      <div className="px-3.5 pt-3 pb-3.5">
        <p className="text-white font-semibold text-[13px] leading-snug truncate">{name}</p>
        <p className="mt-1 text-light-green/70 text-[11px] leading-snug line-clamp-2">{position}</p>
        <p className="mt-1.5 text-white/25 text-[10px]">{year}</p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(to right, transparent, rgba(13,204,88,0.4), transparent)" }}
      />
    </div>
  );
}
