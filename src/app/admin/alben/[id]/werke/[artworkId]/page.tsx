import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string; artworkId: string }>;
}) {
  const { id, artworkId } = await params;
  const artwork = await prisma.artwork.findUnique({ where: { id: artworkId } });
  if (!artwork) notFound();

  async function updateArtwork(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = (formData.get("description") as string) || null;
    const medium = (formData.get("medium") as string) || null;
    const dimensions = (formData.get("dimensions") as string) || null;
    const createdDate = (formData.get("createdDate") as string) || null;

    await prisma.artwork.update({
      where: { id: artworkId },
      data: { title, slug, description, medium, dimensions, createdDate },
    });

    redirect(`/admin/alben/${id}/werke`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-headline text-3xl tracking-tighter mb-8">
        Werk bearbeiten
      </h1>

      <div className="mb-8 bg-surface-container-low p-4">
        <div className="relative aspect-video">
          <Image
            src={artwork.imagePath}
            alt={artwork.title}
            fill
            className="object-contain"
            sizes="600px"
          />
        </div>
      </div>

      <form action={updateArtwork} className="space-y-8">
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Titel
          </label>
          <input
            name="title"
            required
            defaultValue={artwork.title}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Slug
          </label>
          <input
            name="slug"
            required
            defaultValue={artwork.slug}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Material / Technik
            </label>
            <input
              name="medium"
              defaultValue={artwork.medium || ""}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Maße
            </label>
            <input
              name="dimensions"
              defaultValue={artwork.dimensions || ""}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Entstehungsdatum
          </label>
          <input
            name="createdDate"
            defaultValue={artwork.createdDate || ""}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Beschreibung
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={artwork.description || ""}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-12 py-4 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}
