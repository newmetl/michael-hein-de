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
      <header className="mb-20 md:mb-32">
        <h1 className="font-headline text-5xl md:text-7xl tracking-tighter text-on-surface max-w-3xl leading-tight">
          Über <span className="italic font-normal">Michael Hein</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
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
        </section>

        <section className="lg:col-span-7 space-y-8">
          <div className="prose prose-lg max-w-none">
            {page?.content?.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-lg text-on-surface-variant leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
