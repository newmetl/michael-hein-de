import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import PageForm from "./PageForm";

export default async function SeitenPage() {
  const pages = await prisma.page.findMany({
    orderBy: { key: "asc" },
  });

  async function updatePage(
    _prev: { success: boolean; timestamp: number },
    formData: FormData
  ) {
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
    revalidatePath("/");
    revalidatePath("/ueber-mich");
    revalidatePath("/impressum");
    revalidatePath("/datenschutz");

    return { success: true, timestamp: Date.now() };
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
          <PageForm
            key={page.id}
            page={page}
            label={pageLabels[page.key] || page.title}
            action={updatePage}
          />
        ))}
      </div>
    </div>
  );
}
