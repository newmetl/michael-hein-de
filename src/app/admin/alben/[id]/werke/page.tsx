import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";

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

  async function deleteArtwork(formData: FormData) {
    "use server";
    const artworkId = formData.get("artworkId") as string;
    await prisma.artwork.delete({ where: { id: artworkId } });
    revalidatePath(`/admin/alben/${id}/werke`);
  }

  async function setCoverImage(formData: FormData) {
    "use server";
    const imagePath = formData.get("imagePath") as string;
    await prisma.album.update({
      where: { id },
      data: { coverImage: imagePath },
    });
    revalidatePath(`/admin/alben/${id}/werke`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin/alben"
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2 inline-block"
          >
            ← Zurück zu Alben
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {album.artworks.map((artwork) => (
            <div key={artwork.id} className="group">
              <div className="relative aspect-square bg-surface-container-low overflow-hidden">
                <Image
                  src={artwork.thumbPath || artwork.imagePath}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {album.coverImage === artwork.thumbPath && (
                  <span className="absolute top-2 left-2 bg-secondary text-on-secondary px-2 py-1 text-[10px] uppercase tracking-widest">
                    Cover
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h3 className="font-headline text-sm truncate">{artwork.title}</h3>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Link
                    href={`/admin/alben/${id}/werke/${artwork.id}`}
                    className="text-[10px] tracking-widest uppercase border border-outline/20 px-3 py-1 hover:bg-surface-container-low transition-all"
                  >
                    Bearbeiten
                  </Link>
                  <form action={setCoverImage}>
                    <input type="hidden" name="imagePath" value={artwork.thumbPath || artwork.imagePath} />
                    <button
                      type="submit"
                      className="text-[10px] tracking-widest uppercase border border-outline/20 px-3 py-1 hover:bg-surface-container-low transition-all"
                    >
                      Als Cover
                    </button>
                  </form>
                  <form action={deleteArtwork}>
                    <input type="hidden" name="artworkId" value={artwork.id} />
                    <button
                      type="submit"
                      className="text-[10px] tracking-widest uppercase border border-error/20 text-error px-3 py-1 hover:bg-error/5 transition-all"
                    >
                      Löschen
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
