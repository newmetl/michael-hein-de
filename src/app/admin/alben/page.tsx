import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export default async function AlbenPage() {
  const albums = await prisma.album.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { artworks: true } } },
  });

  async function deleteAlbum(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.album.delete({ where: { id } });
    revalidatePath("/admin/alben");
  }

  async function togglePublish(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const album = await prisma.album.findUnique({ where: { id } });
    if (album) {
      await prisma.album.update({
        where: { id },
        data: { published: !album.published },
      });
    }
    revalidatePath("/admin/alben");
  }

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
        <div className="space-y-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-surface-container-lowest p-6 flex items-center gap-6"
            >
              <div className="w-20 h-20 bg-surface-container-low flex-shrink-0 relative overflow-hidden">
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-headline text-xl">{album.title}</h3>
                <p className="text-sm text-on-surface-variant">
                  {album._count.artworks} Werke · /{album.slug}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-[10px] tracking-widest uppercase ${
                  album.published
                    ? "text-secondary bg-secondary/10"
                    : "text-on-surface-variant bg-surface-container-low"
                }`}
              >
                {album.published ? "Veröffentlicht" : "Entwurf"}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/admin/alben/${album.id}/werke`}
                  className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
                >
                  Werke
                </Link>
                <Link
                  href={`/admin/alben/${album.id}`}
                  className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
                >
                  Bearbeiten
                </Link>
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={album.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
                  >
                    {album.published ? "Entwurf" : "Publizieren"}
                  </button>
                </form>
                <form action={deleteAlbum}>
                  <input type="hidden" name="id" value={album.id} />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-error/20 text-error hover:bg-error/5 transition-all"
                  >
                    Löschen
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
