import Link from "next/link";
import SubpageShell from "@/components/SubpageShell";
import CircuitTraces from "@/components/tech/CircuitTraces";
import GridSpotlight from "@/components/tech/GridSpotlight";
import ScrambleText from "@/components/tech/ScrambleText";
import SectionTag from "@/components/tech/SectionTag";

const primary =
  "inline-flex items-center rounded-full bg-neon px-6 py-3 text-sm font-extrabold text-navy transition-colors hover:bg-neon-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon";
const secondary =
  "inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-neon/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon";

/** Full-page notice for a missing page or a crash, in the same shell as the rest of the site. */
export default function ErrorScreen({
  tag,
  lead,
  highlight,
  message,
  children,
}: {
  tag: string;
  lead: string;
  highlight: string;
  message: string;
  /** Extra buttons next to "Back to home" (e.g. a retry). */
  children?: React.ReactNode;
}) {
  return (
    <SubpageShell>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-navy pb-32 pt-28 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <GridSpotlight />
        <CircuitTraces tone="dark" corners={["tr", "bl"]} className="hidden lg:block" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 min-[401px]:px-6 md:px-16">
          <SectionTag label={tag} tone="dark" />
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            {lead}
            <br />
            <span className="mt-3 inline-block -rotate-2 rounded-full bg-neon px-5 py-1.5 text-[0.8em] text-navy shadow-[0_0_40px_rgba(196,255,71,0.25)] md:mt-4 md:px-7 md:py-2">
              <ScrambleText text={highlight} />
            </span>
          </h1>
          <p className="mt-8 max-w-lg font-medium leading-relaxed text-white/60">{message}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className={primary}>
              Back to home
            </Link>
            {children}
            <Link href="/calendar" className={secondary}>
              Calendar of activities
            </Link>
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}

export { primary as errorPrimaryButton, secondary as errorSecondaryButton };
