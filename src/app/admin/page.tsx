import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [albumCount, artworkCount, publishedAlbums, draftAlbums] =
    await Promise.all([
      prisma.album.count(),
      prisma.artwork.count(),
      prisma.album.count({ where: { published: true } }),
      prisma.album.count({ where: { published: false } }),
    ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-headline text-3xl tracking-tighter">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-lowest p-6">
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Alben
          </p>
          <p className="font-headline text-4xl">{albumCount}</p>
        </div>
        <div className="bg-surface-container-lowest p-6">
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Werke
          </p>
          <p className="font-headline text-4xl">{artworkCount}</p>
        </div>
        <div className="bg-surface-container-lowest p-6">
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Veröffentlicht
          </p>
          <p className="font-headline text-4xl">{publishedAlbums}</p>
        </div>
        <div className="bg-surface-container-lowest p-6">
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Entwürfe
          </p>
          <p className="font-headline text-4xl">{draftAlbums}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/alben/neu"
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-8 py-3 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
        >
          Neues Album
        </Link>
        <Link
          href="/admin/seiten"
          className="border border-outline/20 text-on-surface px-8 py-3 font-label uppercase text-xs tracking-widest hover:bg-surface-container-low transition-all"
        >
          Seiten bearbeiten
        </Link>
      </div>
    </div>
  );
}
