import Image from "next/image";

/** Judy, the JPCS sloth mascot (public/JPCS_MASCOT.png). Used by the launcher and message bubbles. */
export default function BotAvatar({ size = 32, plain = false }: { size?: number; plain?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${plain ? "" : "bg-neon"}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/JPCS_MASCOT.png"
        alt=""
        width={size * 2}
        height={size * 2}
        sizes={`${size * 2}px`}
        className="h-full w-full scale-110 object-contain"
      />
    </span>
  );
}
