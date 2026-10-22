import SubpageShell from "@/components/SubpageShell";

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubpageShell className="bg-off-white">{children}</SubpageShell>;
}
