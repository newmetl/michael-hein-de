import { prisma } from "@/lib/prisma";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über mich",
  description: "Erfahren Sie mehr über Michael Hein und seine Arbeit.",
};

export default async function UeberMichPage() {
  const page = await prisma.page.findUnique({ where: { key: "about" } });

  return (
    <div className="px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="mb-20 md:mb-32">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-[5.5rem] tracking-editorial text-on-surface max-w-4xl leading-[1.05]">
          Über <span className="italic font-normal">Michael Hein</span>
        </h1>
      </header>

      {/* Main Content: Asymmetric Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
        {/* Left Side: Portrait */}
        <section className="lg:col-span-5 space-y-12">
          <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
            {page?.heroImage ? (
              <Image
                src={page.heroImage}
                alt="Michael Hein"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            )}
          </div>

          {/* Fine Details */}
          <div className="pt-8 border-t border-outline-variant/20 space-y-6">
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3">Standort</p>
              <p className="font-headline text-lg">Konstanz, Süddeutschland</p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3">Schwerpunkte</p>
              <p className="font-headline text-lg italic">Kunstobjekte, Fotografie, Mixed Media</p>
            </div>
          </div>
        </section>

        {/* Right Side: Biography */}
        <section className="lg:col-span-7 space-y-0">
          <div>
            {page?.content?.split("\n\n").map((paragraph, i) => (
              <p key={i} className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed mb-8 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
