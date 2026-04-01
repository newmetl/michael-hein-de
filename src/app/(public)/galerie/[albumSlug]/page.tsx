import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ albumSlug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug } = await params;
  const album = await prisma.album.findUnique({ where: { slug: albumSlug } });
  if (!album) return {};
  return {
    title: album.title,
    description: album.description || `Werke im Album "${album.title}" von Michael Hein.`,
  };
}

export default async function AlbumPage({ params, searchParams }: Props) {
  const { albumSlug } = await params;
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;
  const perPage = 16;
  const skip = (currentPage - 1) * perPage;

  const album = await prisma.album.findUnique({
    where: { slug: albumSlug, published: true },
  });

  if (!album) notFound();

  const [artworks, total] = await Promise.all([
    prisma.artwork.findMany({
      where: { albumId: album.id, published: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: perPage,
    }),
    prisma.artwork.count({ where: { albumId: album.id, published: true } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
      {/* Back Link */}
      <div className="mb-12">
        <Link
          href="/galerie"
          className="font-headline text-lg italic text-on-surface flex items-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span className="border-b border-secondary/40 pb-0.5 group-hover:border-secondary transition-colors">
            Zurück zur Galerie
          </span>
        </Link>
      </div>

      {/* Album Header */}
      <section className="mb-20 md:mb-28">
        <h1 className="font-headline text-5xl md:text-7xl tracking-editorial text-on-background mb-6 leading-[1.05]">
          {album.title}
        </h1>
        {album.description && (
          <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed font-normal max-w-3xl">
            {album.description}
          </p>
        )}
      </section>

      {/* Artworks Grid with Matting Effect */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {artworks.map((artwork) => (
          <Link
            key={artwork.id}
            href={`/galerie/${albumSlug}/${artwork.slug}`}
            className="group cursor-pointer"
          >
            <div className="bg-surface-container-low p-6 overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={artwork.thumbPath || artwork.imagePath}
                  alt={artwork.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-baseline">
              <h3 className="font-headline text-lg md:text-xl group-hover:text-secondary transition-colors">
                {artwork.title}
              </h3>
              {artwork.createdDate && (
                <span className="text-xs font-label text-on-surface-variant ml-4 shrink-0">
                  {artwork.createdDate}
                </span>
              )}
            </div>
            {artwork.medium && (
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-1">
                {artwork.medium}
              </p>
            )}
          </Link>
        ))}
      </section>

      {artworks.length === 0 && (
        <p className="text-center text-on-surface-variant text-lg py-24">
          Noch keine Werke in diesem Album.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-28 flex justify-center gap-4">
          {currentPage > 1 && (
            <Link
              href={`/galerie/${albumSlug}?page=${currentPage - 1}`}
              className="px-8 py-3 border border-outline/20 font-body text-xs tracking-widest uppercase text-on-surface hover:bg-surface-container-low transition-all"
            >
              Zurück
            </Link>
          )}
          <span className="px-8 py-3 font-body text-xs tracking-widest uppercase text-on-surface-variant">
            Seite {currentPage} von {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/galerie/${albumSlug}?page=${currentPage + 1}`}
              className="px-8 py-3 border border-outline/20 font-body text-xs tracking-widest uppercase text-on-surface hover:bg-surface-container-low transition-all"
            >
              Weiter
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
