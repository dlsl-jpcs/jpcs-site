import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import ChatWidget from "@/components/chat/ChatWidget";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased bg-charcoal text-white overflow-x-hidden`}
      >
        <MotionProvider>
          {children}
          <ChatWidget />
        </MotionProvider>
      </body>
    </html>
  );
}
