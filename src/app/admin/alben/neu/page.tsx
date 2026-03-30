import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/utils";

export default function NeuesAlbumPage() {
  async function createAlbum(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || generateSlug(title);
    const description = (formData.get("description") as string) || null;
    const published = formData.get("published") === "on";

    const maxOrder = await prisma.album.aggregate({ _max: { sortOrder: true } });

    await prisma.album.create({
      data: {
        title,
        slug,
        description,
        published,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    redirect("/admin/alben");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-headline text-3xl tracking-tighter mb-8">
        Neues Album
      </h1>
      <form action={createAlbum} className="space-y-8">
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Titel
          </label>
          <input
            name="title"
            required
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Slug (wird automatisch generiert)
          </label>
          <input
            name="slug"
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            placeholder="wird-automatisch-generiert"
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
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            className="accent-secondary"
          />
          <label htmlFor="published" className="font-label text-sm text-on-surface">
            Sofort veröffentlichen
          </label>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-12 py-4 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
        >
          Album erstellen
        </button>
      </form>
    </div>
  );
}
