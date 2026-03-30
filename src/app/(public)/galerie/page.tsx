import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Entdecken Sie die Alben und Werke von Michael Hein.",
};

export default async function GaleriePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const perPage = 12;
  const skip = (currentPage - 1) * perPage;

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { artworks: true } } },
      skip,
      take: perPage,
    }),
    prisma.album.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
      <section className="mb-24">
        <h1 className="font-headline text-5xl md:text-7xl tracking-tighter text-on-background mb-6 leading-tight">
          Galerie
        </h1>
        <p className="font-body text-xl text-on-surface-variant leading-relaxed font-light max-w-3xl">
          Eine kuratierte Auswahl von Kunstobjekten und fotografischen Arbeiten.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/galerie/${album.slug}`}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/3] bg-surface-container-low overflow-hidden relative">
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h2 className="font-headline text-2xl mb-2 group-hover:text-secondary transition-colors">
                  {album.title}
                </h2>
                {album.description && (
                  <p className="font-body text-on-surface-variant text-sm max-w-md">
                    {album.description}
                  </p>
                )}
              </div>
              <span className="font-label text-sm uppercase tracking-widest text-secondary pt-2 whitespace-nowrap">
                {album._count.artworks} {album._count.artworks === 1 ? "Werk" : "Werke"}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="mt-24 flex justify-center gap-4">
          {currentPage > 1 && (
            <Link
              href={`/galerie?page=${currentPage - 1}`}
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
              href={`/galerie?page=${currentPage + 1}`}
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
