import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SortableAlbumList from "./SortableAlbumList";

export default async function AlbenPage() {
  const albums = await prisma.album.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { artworks: true } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-3xl tracking-tighter">Alben</h1>
        <Link
          href="/admin/alben/neu"
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-8 py-3 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
        >
          Neues Album
        </Link>
      </div>

      {albums.length === 0 ? (
        <p className="text-on-surface-variant py-12 text-center">
          Noch keine Alben vorhanden.
        </p>
      ) : (
        <SortableAlbumList initialAlbums={albums} />
      )}
    </div>
  );
}
