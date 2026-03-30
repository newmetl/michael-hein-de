import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function SeitenPage() {
  const pages = await prisma.page.findMany({
    orderBy: { key: "asc" },
  });

  async function updatePage(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const content = formData.get("content") as string;
    const heroTitle = (formData.get("heroTitle") as string) || null;
    const heroSubtitle = (formData.get("heroSubtitle") as string) || null;

    await prisma.page.update({
      where: { id },
      data: { content, heroTitle, heroSubtitle },
    });

    revalidatePath("/admin/seiten");
  }

  const pageLabels: Record<string, string> = {
    home: "Startseite",
    about: "Über mich",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
  };

  return (
    <div>
      <h1 className="font-headline text-3xl tracking-tighter mb-8">
        Seiten verwalten
      </h1>

      <div className="space-y-12">
        {pages.map((page) => (
          <form
            key={page.id}
            action={updatePage}
            className="bg-surface-container-lowest p-8"
          >
            <input type="hidden" name="id" value={page.id} />
            <h2 className="font-headline text-xl mb-6">
              {pageLabels[page.key] || page.title}
            </h2>

            {page.key === "home" && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                    Hero Titel
                  </label>
                  <input
                    name="heroTitle"
                    defaultValue={page.heroTitle || ""}
                    className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                    Hero Untertitel
                  </label>
                  <input
                    name="heroSubtitle"
                    defaultValue={page.heroSubtitle || ""}
                    className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                Inhalt (Markdown)
              </label>
              <textarea
                name="content"
                rows={10}
                defaultValue={page.content}
                className="w-full bg-transparent border border-outline/20 p-4 focus:ring-0 focus:border-secondary transition-colors resize-y font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-8 py-3 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
            >
              Speichern
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
