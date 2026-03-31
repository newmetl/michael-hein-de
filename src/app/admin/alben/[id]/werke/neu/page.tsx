import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { processImage } from "@/lib/upload";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";
import MultiUpload from "./MultiUpload";

export default async function NeuesWerkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) notFound();

  async function createArtwork(formData: FormData) {
    "use server";
    const file = formData.get("image") as File;
    if (!file || file.size === 0) throw new Error("Bitte ein Bild auswählen");

    const { displayPath, thumbPath } = await processImage(file);

    const title = (formData.get("title") as string) || file.name.replace(/\.[^/.]+$/, "");
    const slug = (formData.get("slug") as string) || generateSlug(title);
    const description = (formData.get("description") as string) || null;
    const medium = (formData.get("medium") as string) || null;
    const dimensions = (formData.get("dimensions") as string) || null;
    const createdDate = (formData.get("createdDate") as string) || null;

    const maxOrder = await prisma.artwork.aggregate({
      where: { albumId: id },
      _max: { sortOrder: true },
    });

    await prisma.artwork.create({
      data: {
        title,
        slug,
        description,
        medium,
        dimensions,
        createdDate,
        imagePath: displayPath,
        thumbPath,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
        albumId: id,
      },
    });

    redirect(`/admin/alben/${id}/werke`);
  }

  return (
    <div>
      <Link
        href={`/admin/alben/${id}/werke`}
        className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-2 inline-block"
      >
        &larr; Zurück zu Werken
      </Link>
      <h1 className="font-headline text-3xl tracking-tighter mb-2">
        Werke hinzufügen
      </h1>
      <p className="text-on-surface-variant mb-8">Album: {album.title}</p>

      {/* Multi-Upload */}
      <div className="mb-16">
        <h2 className="font-headline text-xl mb-6">Schnell-Upload</h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Mehrere Bilder gleichzeitig hochladen. Titel werden aus dem Dateinamen generiert.
        </p>
        <MultiUpload albumId={id} />
      </div>

      {/* Single Upload with full metadata */}
      <div className="max-w-2xl">
        <h2 className="font-headline text-xl mb-6">Einzelnes Werk mit Details</h2>
        <form action={createArtwork} className="space-y-8">
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Bild *
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="w-full file:mr-4 file:py-2 file:px-4 file:border file:border-outline/20 file:text-sm file:bg-transparent file:text-on-surface hover:file:bg-surface-container-low file:transition-all"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Titel (wird aus Dateiname generiert wenn leer)
            </label>
            <input
              name="title"
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Slug
            </label>
            <input
              name="slug"
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
              placeholder="wird-automatisch-generiert"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                Material / Technik
              </label>
              <input
                name="medium"
                className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
                placeholder="z.B. Acryl auf Holz"
              />
            </div>
            <div>
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                Maße
              </label>
              <input
                name="dimensions"
                className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
                placeholder="z.B. 30 x 40 cm"
              />
            </div>
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Entstehungsdatum
            </label>
            <input
              name="createdDate"
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
              placeholder="z.B. 2023 oder März 2024"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Beschreibung
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-12 py-4 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
          >
            Werk erstellen
          </button>
        </form>
      </div>
    </div>
  );
}
