/**
 * Placeholder chatbot mark: a ">_" terminal prompt. Swap this one file for the real logo later
 * (e.g. an <Image src="/chat/bot.png" />); the launcher and message bubbles both use it.
 */
export default function BotAvatar({ size = 32, plain = false }: { size?: number; plain?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${plain ? "" : "bg-neon text-navy"}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7l5 5-5 5" />
        <path d="M13 17h6" />
      </svg>
    </span>
  );
}
