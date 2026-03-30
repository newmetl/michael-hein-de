import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) notFound();

  async function updateAlbum(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = (formData.get("description") as string) || null;
    const published = formData.get("published") === "on";

    await prisma.album.update({
      where: { id },
      data: { title, slug, description, published },
    });

    redirect("/admin/alben");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-headline text-3xl tracking-tighter mb-8">
        Album bearbeiten
      </h1>
      <form action={updateAlbum} className="space-y-8">
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Titel
          </label>
          <input
            name="title"
            required
            defaultValue={album.title}
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
            defaultValue={album.slug}
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
            defaultValue={album.description || ""}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors resize-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={album.published}
            className="accent-secondary"
          />
          <label htmlFor="published" className="font-label text-sm text-on-surface">
            Veröffentlicht
          </label>
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
