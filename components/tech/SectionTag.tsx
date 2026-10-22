import Typewriter from "./Typewriter";

/** Mono eyebrow above a section heading, e.g. `// 01 — about`. Decorative, so screen readers skip it. */
export default function SectionTag({ label, tone = "light", className = "" }: { label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      aria-hidden="true"
      className={`font-mono text-xs min-[401px]:text-sm font-medium tracking-wider mb-4 ${
        tone === "dark" ? "text-neon/80" : "text-navy/45"
      } ${className}`}
    >
      <Typewriter text={label} decorative speed={45} />
    </p>
  );
}
