import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://michael-hein.de";

  const albums = await prisma.album.findMany({
    where: { published: true },
    include: { artworks: { where: { published: true }, select: { slug: true, updatedAt: true } } },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/galerie`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/ueber-mich`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const albumPages: MetadataRoute.Sitemap = albums.map((album) => ({
    url: `${baseUrl}/galerie/${album.slug}`,
    lastModified: album.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const artworkPages: MetadataRoute.Sitemap = albums.flatMap((album) =>
    album.artworks.map((artwork) => ({
      url: `${baseUrl}/galerie/${album.slug}/${artwork.slug}`,
      lastModified: artwork.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...albumPages, ...artworkPages];
}
