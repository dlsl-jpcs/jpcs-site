import type { Metadata } from "next";
import ErrorScreen from "@/components/ErrorScreen";

export const metadata: Metadata = {
  title: "Page not found | JPCS DLSL",
};

export default function NotFound() {
  return (
    <ErrorScreen
      tag="// error 404 — route not found"
      lead="Page not"
      highlight="found"
      message="That link doesn't lead anywhere. It may have moved, or the address was mistyped."
    />
  );
}
