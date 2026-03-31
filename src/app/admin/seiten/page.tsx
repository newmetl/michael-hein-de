import { prisma } from "@/lib/prisma";
import { processImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import PageForm from "./PageForm";

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

    const data: Record<string, unknown> = { content, heroTitle, heroSubtitle };

    const profileImage = formData.get("profileImage") as File | null;
    if (profileImage && profileImage.size > 0) {
      const result = await processImage(profileImage);
      data.heroImage = result.displayPath;
    }

    await prisma.page.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/seiten");
    revalidatePath("/");
    revalidatePath("/ueber-mich");
    revalidatePath("/impressum");
    revalidatePath("/datenschutz");
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
