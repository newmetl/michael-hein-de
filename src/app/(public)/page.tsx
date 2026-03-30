import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const page = await prisma.page.findUnique({ where: { key: "home" } });
  const albums = await prisma.album.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { artworks: true } } },
    take: 6,
  });

  return (
    <>
      <header className="px-6 md:px-12 mb-24 max-w-7xl">
        <h1 className="font-headline text-5xl md:text-7xl tracking-tighter mb-8 leading-[1.1]">
          {page?.heroTitle || "Kunstobjekte &"} <br />
          <span className="italic text-secondary">
            {page?.heroSubtitle || "Fotografie"}
          </span>
        </h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          Zeitgenössische Werke von Michael Hein. Entdecken Sie die Galerie
          und lassen Sie sich von einzigartigen Kunstobjekten und
          fotografischen Arbeiten inspirieren.
        </p>
      </header>

      {albums.length > 0 && (
        <section className="px-6 md:px-12">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-headline text-4xl tracking-tight">Alben</h2>
            <Link
              href="/galerie"
              className="font-label text-sm uppercase tracking-widest text-secondary hover:text-on-surface transition-colors"
            >
              Alle Alben
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 opacity-30">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="font-headline text-2xl mb-2 group-hover:text-secondary transition-colors">
                    {album.title}
                  </h3>
                  <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
                    {album._count.artworks} {album._count.artworks === 1 ? "Werk" : "Werke"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
