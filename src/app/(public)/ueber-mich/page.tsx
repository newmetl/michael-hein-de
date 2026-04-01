import { prisma } from "@/lib/prisma";
import Image from "next/image";
import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const dynamic = "force-dynamic";

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
        {/* Left Side: Portrait & Biography */}
        <section className="lg:col-span-5 space-y-12">
          <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
            {page?.heroImage ? (
              <Image
                src={page.heroImage}
                alt="Michael Hein"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* Biography Text */}
          <div className="space-y-6">
            {page?.content?.split("\n\n").map((paragraph, i) => (
              <p key={i} className="font-body text-lg text-on-surface-variant leading-relaxed">
                {paragraph}
              </p>
            ))}
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

        {/* Right Side: Contact Form */}
        <section id="kontakt" className="lg:col-span-7 bg-surface-container-low p-8 md:p-16 scroll-mt-36">
          <div className="max-w-xl">
            <h3 className="font-headline text-3xl mb-4">Kontakt</h3>
            <p className="font-body text-on-surface-variant mb-12">
              Für Anfragen zu Kunstwerken, Auftragsarbeiten oder Ausstellungen nutzen Sie bitte das folgende Formular.
            </p>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
