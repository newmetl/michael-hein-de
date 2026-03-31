import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const page = await prisma.page.findUnique({ where: { key: "home" } });
  const albums = await prisma.album.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { artworks: true } },
      artworks: {
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      },
    },
    take: 6,
  });

  // Collect featured artworks from all albums for the masonry grid
  const featuredArtworks = albums.flatMap((album) =>
    album.artworks.map((artwork) => ({ ...artwork, albumSlug: album.slug, albumTitle: album.title }))
  ).slice(0, 6);

  // First album as featured
  const featuredAlbum = albums[0];

  return (
    <>
      {/* Hero Section */}
      <header className="px-6 md:px-12 mb-28 md:mb-36 max-w-7xl">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-[5.5rem] tracking-editorial mb-8 leading-[1.05]">
          {page?.heroTitle || "Kunstobjekte &"} <br />
          <span className="italic text-secondary">
            {page?.heroSubtitle || "Fotografie"}
          </span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed font-normal">
          Zeitgenössische Werke von Michael Hein. Entdecken Sie die Galerie
          und lassen Sie sich von einzigartigen Kunstobjekten und
          fotografischen Arbeiten inspirieren.
        </p>
      </header>

      {/* Masonry Gallery Grid */}
      {featuredArtworks.length > 0 && (
        <section className="px-6 md:px-12">
          <div className="masonry-grid">
            {featuredArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/galerie/${artwork.albumSlug}/${artwork.slug}`}
                className="masonry-item art-card group relative block cursor-pointer"
              >
                <div className="p-6 bg-surface-container-low">
                  <Image
                    src={artwork.thumbPath || artwork.imagePath}
                    alt={artwork.title}
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
                <div className="art-card-overlay absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-on-primary">
                  <p className="font-headline text-xl md:text-2xl mb-1">{artwork.title}</p>
                  <p className="font-label text-sm uppercase tracking-widest opacity-80">
                    {artwork.albumTitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Album Section (Asymmetric) */}
      {featuredAlbum && (
        <section className="mt-36 md:mt-48 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <span className="font-label text-sm tracking-[0.2em] text-secondary uppercase mb-6 block">
              Ausgewähltes Album
            </span>
            <h2 className="font-headline text-4xl md:text-5xl tracking-editorial mb-8 leading-tight">
              {featuredAlbum.title}
            </h2>
            {featuredAlbum.description && (
              <p className="font-body text-lg text-on-surface-variant mb-12 leading-relaxed">
                {featuredAlbum.description}
              </p>
            )}
            <Link
              href={`/galerie/${featuredAlbum.slug}`}
              className="inline-block font-headline text-xl text-on-surface gallery-link"
            >
              Sammlung entdecken
            </Link>
          </div>
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
              {featuredAlbum.coverImage ? (
                <Image
                  src={featuredAlbum.coverImage}
                  alt={featuredAlbum.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
              )}
              {/* Floating Note */}
              <div className="absolute bottom-8 right-8 bg-surface-container-lowest/80 backdrop-blur-md p-6 max-w-xs hidden md:block">
                <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  Kollektion
                </p>
                <p className="font-headline text-lg italic">
                  {featuredAlbum._count.artworks} {featuredAlbum._count.artworks === 1 ? "Werk" : "Werke"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Albums Preview */}
      {albums.length > 1 && (
        <section className="mt-36 md:mt-48 px-6 md:px-12">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-headline text-3xl md:text-4xl tracking-editorial">
              Alle Alben
            </h2>
            <Link
              href="/galerie"
              className="font-label text-sm uppercase tracking-widest text-secondary hover:text-on-surface transition-colors"
            >
              Zur Galerie
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {albums.slice(1, 4).map((album) => (
              <Link
                key={album.id}
                href={`/galerie/${album.slug}`}
                className="group"
              >
                <div className="aspect-square bg-surface-container-low mb-8 overflow-hidden">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <time className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                  {album._count.artworks} {album._count.artworks === 1 ? "Werk" : "Werke"}
                </time>
                <h3 className="font-headline text-2xl mt-3 mb-3 group-hover:text-secondary transition-colors">
                  {album.title}
                </h3>
                {album.description && (
                  <p className="font-body text-on-surface-variant leading-relaxed line-clamp-2">
                    {album.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
