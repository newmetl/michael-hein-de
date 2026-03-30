import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
