import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import SortableArtworkGrid from "./SortableArtworkGrid";

export default async function WerkePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      artworks: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!album) notFound();

  const otherAlbums = await prisma.album.findMany({
    where: { id: { not: id } },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin/alben"
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2 inline-block"
          >
            &larr; Zurück zu Alben
          </Link>
          <h1 className="font-headline text-3xl tracking-tighter">
            Werke in &ldquo;{album.title}&rdquo;
          </h1>
        </div>
        <Link
          href={`/admin/alben/${id}/werke/neu`}
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-8 py-3 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
        >
          Neues Werk
        </Link>
      </div>

      {album.artworks.length === 0 ? (
        <p className="text-on-surface-variant py-12 text-center">
          Noch keine Werke in diesem Album.
        </p>
      ) : (
        <SortableArtworkGrid
          initialArtworks={album.artworks}
          albumId={id}
          coverImage={album.coverImage}
          otherAlbums={otherAlbums}
        />
      )}
    </div>
  );
}
