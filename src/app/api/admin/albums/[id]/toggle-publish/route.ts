import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.album.update({
    where: { id },
    data: { published: !album.published },
  });

  return NextResponse.json({ success: true });
}
