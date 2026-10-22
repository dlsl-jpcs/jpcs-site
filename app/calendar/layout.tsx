import SubpageShell from "@/components/SubpageShell";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubpageShell>{children}</SubpageShell>;
}
