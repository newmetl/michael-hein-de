import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ albumSlug: string; artworkSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artworkSlug } = await params;
  const artwork = await prisma.artwork.findUnique({
    where: { slug: artworkSlug },
    include: { album: true },
  });
  if (!artwork) return {};
  return {
    title: artwork.title,
    description: artwork.description || `${artwork.title} – ${artwork.medium || "Werk"} von Michael Hein`,
    openGraph: {
      images: [{ url: artwork.imagePath }],
    },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { albumSlug, artworkSlug } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: { slug: artworkSlug },
    include: { album: true },
  });

  if (!artwork || artwork.album.slug !== albumSlug) notFound();

  const siblings = await prisma.artwork.findMany({
    where: { albumId: artwork.albumId, published: true },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, sortOrder: true, title: true },
  });

  const currentIndex = siblings.findIndex((s) => s.slug === artworkSlug);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  const dimensions = artwork.dimensions || [artwork.width, artwork.height, artwork.depth].filter(Boolean).join(" × ");

  return (
    <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
      {/* Back Link */}
      <div className="mb-12">
        <Link
          href={`/galerie/${albumSlug}`}
          className="font-headline text-lg italic text-on-surface flex items-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span className="border-b border-secondary/40 pb-0.5 group-hover:border-secondary transition-colors">
            Zurück zu {artwork.album.title}
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
        {/* Left: Artwork Display (Matting Effect) */}
        <div className="w-full lg:w-3/5 art-mat">
          <div className="relative overflow-hidden bg-surface-container-lowest p-4 md:p-6">
            <Image
              src={artwork.imagePath}
              alt={artwork.title}
              width={1200}
              height={900}
              className="w-full h-auto object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </div>

        {/* Right: Details (Editorial Hierarchy) */}
        <div className="w-full lg:w-2/5 flex flex-col space-y-12 lg:sticky lg:top-40">
          <section className="space-y-4">
            <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary font-semibold">
              {artwork.album.title}
            </p>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-[3.5rem] tracking-editorial leading-tight text-on-background">
              {artwork.title}
            </h1>
          </section>

          <div className="space-y-8">
            {/* Metadata Grid */}
            {(artwork.medium || dimensions || artwork.createdDate) && (
              <div className="grid grid-cols-2 gap-8 border-y border-on-surface/5 py-8">
                {artwork.medium && (
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant mb-1.5">
                      Material / Technik
                    </p>
                    <p className="font-body text-base text-on-surface">{artwork.medium}</p>
                  </div>
                )}
                {dimensions && (
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant mb-1.5">
                      Maße
                    </p>
                    <p className="font-body text-base text-on-surface">{dimensions}</p>
                  </div>
                )}
                {artwork.createdDate && (
                  <div>
                    <p className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant mb-1.5">
                      Entstehung
                    </p>
                    <p className="font-body text-base text-on-surface">{artwork.createdDate}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {artwork.description && (
              <p className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant">
                {artwork.description}
              </p>
            )}
          </div>

          {/* Prev/Next Navigation */}
          <div className="flex justify-between pt-8 border-t border-on-surface/5">
            {prev ? (
              <Link
                href={`/galerie/${albumSlug}/${prev.slug}`}
                className="font-label text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <span className="hidden sm:inline">{prev.title}</span>
                <span className="sm:hidden">Zurück</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/galerie/${albumSlug}/${next.slug}`}
                className="font-label text-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">{next.title}</span>
                <span className="sm:hidden">Weiter</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
