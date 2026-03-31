import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processImage } from "@/lib/upload";
import { generateSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const title = (formData.get("title") as string) || file.name.replace(/\.[^/.]+$/, "");
  const albumId = formData.get("albumId") as string;

  if (!file || !albumId) {
    return NextResponse.json({ error: "Missing file or albumId" }, { status: 400 });
  }

  const { displayPath, thumbPath } = await processImage(file);
  const slug = generateSlug(title);

  const maxOrder = await prisma.artwork.aggregate({
    where: { albumId },
    _max: { sortOrder: true },
  });

  const artwork = await prisma.artwork.create({
    data: {
      title,
      slug: `${slug}-${Date.now()}`,
      imagePath: displayPath,
      thumbPath,
      sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      albumId,
    },
  });

  return NextResponse.json(artwork);
}
