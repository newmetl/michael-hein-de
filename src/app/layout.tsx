import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Michael Hein – Kunstobjekte & Fotografie",
    template: "%s | Michael Hein",
  },
  description: "Zeitgenössische Kunstobjekte und Fotografie von Michael Hein.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning className={`${notoSerif.variable} ${manrope.variable}`}>
      <body className="font-body font-normal">{children}</body>
    </html>
  );
}
