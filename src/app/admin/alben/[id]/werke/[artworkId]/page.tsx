import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { processImage, deleteImage } from "@/lib/upload";
import ArtworkEditForm from "./ArtworkEditForm";

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

    const imageFile = formData.get("image") as File | null;

    const data: Record<string, unknown> = {
      title,
      slug,
      description,
      medium,
      dimensions,
      createdDate,
    };

    if (imageFile && imageFile.size > 0) {
      const current = await prisma.artwork.findUnique({
        where: { id: artworkId },
      });
      if (current) {
        await deleteImage(current.imagePath);
      }

      const { displayPath, thumbPath } = await processImage(imageFile);
      data.imagePath = displayPath;
      data.thumbPath = thumbPath;
    }

    await prisma.artwork.update({
      where: { id: artworkId },
      data,
    });

    redirect(`/admin/alben/${id}/werke`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-headline text-3xl tracking-tighter mb-8">
        Werk bearbeiten
      </h1>

      <ArtworkEditForm artwork={artwork} action={updateArtwork} />
    </div>
  );
}
