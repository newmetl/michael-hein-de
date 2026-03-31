import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { albumId } = await request.json();

  const maxOrder = await prisma.artwork.aggregate({
    where: { albumId },
    _max: { sortOrder: true },
  });

  await prisma.artwork.update({
    where: { id },
    data: {
      albumId,
      sortOrder: (maxOrder._max.sortOrder || 0) + 1,
    },
  });

  return NextResponse.json({ success: true });
}
