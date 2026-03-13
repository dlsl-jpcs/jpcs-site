import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "JPCS DLSL | Junior Philippine Computer Society",
  description:
    "The premier organization for CS, IT, and ACT students at De La Salle Lipa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} font-sans antialiased bg-charcoal text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
