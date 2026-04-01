import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const UPLOAD_DISPLAY = path.join(UPLOAD_DIR, "display");
const UPLOAD_THUMB = path.join(UPLOAD_DIR, "thumb");

for (const dir of [UPLOAD_DISPLAY, UPLOAD_THUMB]) {
  fs.mkdirSync(dir, { recursive: true });
}

function generateSvg(width: number, height: number, palette: string[], seed: number): string {
  const r = (n: number, offset = 0) =>
    (((seed + offset) * 9301 + 49297) % 233280) / 233280 * n;

  const elements: string[] = [];
  elements.push(`<rect width="${width}" height="${height}" fill="${palette[0]}"/>`);

  for (let i = 0; i < 8; i++) {
    const cx = r(width, i * 71);
    const cy = r(height, i * 137);
    const rx = 40 + r(Math.min(width, height) * 0.4, i * 53);
    const ry = 40 + r(Math.min(width, height) * 0.4, i * 97);
    elements.push(
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${palette[(i + 1) % palette.length]}" opacity="${0.3 + r(0.5, i * 31)}" transform="rotate(${r(180, i * 43)} ${cx} ${cy})"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${elements.join("")}</svg>`;
}

async function generateImage(
  svgString: string,
  baseName: string,
): Promise<{ display: string; thumb: string }> {
  const displayPath = `/api/uploads/display/${baseName}.webp`;
  const thumbPath = `/api/uploads/thumb/${baseName}.webp`;

  const svgBuffer = Buffer.from(svgString);

  await sharp(svgBuffer)
    .webp({ quality: 85 })
    .toFile(path.join(UPLOAD_DISPLAY, `${baseName}.webp`));

  await sharp(svgBuffer)
    .resize(400, null, { withoutEnlargement: false })
    .webp({ quality: 80 })
    .toFile(path.join(UPLOAD_THUMB, `${baseName}.webp`));

  return { display: displayPath, thumb: thumbPath };
}

interface TestArtwork {
  title: string;
  width: number;
  height: number;
}

interface TestAlbum {
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  palette: string[];
  coverSize: { width: number; height: number };
  artworks: TestArtwork[];
}

const testAlbums: TestAlbum[] = [
  {
    title: "Vertikale",
    slug: "test-vertikale",
    description: "Hochformat-Serie — Türme, Säulen und aufstrebende Formen.",
    sortOrder: 100,
    palette: ["#1a1a2e", "#4a3f6b", "#7b6aad", "#c4b8e0", "#e94560"],
    coverSize: { width: 800, height: 1200 },
    artworks: [
      { title: "Turm I", width: 800, height: 1200 },
      { title: "Aufstieg", width: 600, height: 1000 },
      { title: "Säule", width: 700, height: 1400 },
      { title: "Vertikale Linie", width: 500, height: 1200 },
    ],
  },
  {
    title: "Panoramen",
    slug: "test-panoramen",
    description: "Ultraweitformat — weite Landschaften und Horizonte.",
    sortOrder: 101,
    palette: ["#2c3e50", "#2980b9", "#3498db", "#ecf0f1", "#e67e22"],
    coverSize: { width: 2400, height: 800 },
    artworks: [
      { title: "Horizont", width: 2400, height: 800 },
      { title: "Weite", width: 2000, height: 700 },
      { title: "Küstenlinie", width: 1800, height: 600 },
    ],
  },
  {
    title: "Quadrate",
    slug: "test-quadrate",
    description: "Quadratische Kompositionen — Balance und Symmetrie.",
    sortOrder: 102,
    palette: ["#2d3435", "#5a6061", "#adb3b4", "#e4e9ea", "#c9a96e"],
    coverSize: { width: 1000, height: 1000 },
    artworks: [
      { title: "Gleichgewicht", width: 1000, height: 1000 },
      { title: "Zentrum", width: 1200, height: 1200 },
      { title: "Rahmen", width: 800, height: 800 },
    ],
  },
  {
    title: "Gemischte Formate",
    slug: "test-gemischte-formate",
    description: "Unterschiedliche Seitenverhältnisse in einer Sammlung.",
    sortOrder: 103,
    palette: ["#4a2c2a", "#854442", "#be9b7b", "#3c6e4f", "#d4a574"],
    coverSize: { width: 1200, height: 900 },
    artworks: [
      { title: "Breit", width: 1600, height: 900 },
      { title: "Schmal hoch", width: 600, height: 1400 },
      { title: "Quadrat", width: 1000, height: 1000 },
      { title: "Panorama", width: 2000, height: 600 },
      { title: "Hochformat", width: 800, height: 1100 },
      { title: "Leicht quer", width: 1200, height: 1000 },
    ],
  },
];

async function main() {
  // Remove existing test albums
  const existingSlugs = testAlbums.map((a) => a.slug);
  await prisma.artwork.deleteMany({
    where: { album: { slug: { in: existingSlugs } } },
  });
  await prisma.album.deleteMany({
    where: { slug: { in: existingSlugs } },
  });

  console.log("Creating test albums with varied aspect ratios...\n");

  for (const albumData of testAlbums) {
    const { artworks, palette, coverSize, ...fields } = albumData;

    const coverSvg = generateSvg(coverSize.width, coverSize.height, palette, fields.sortOrder * 1000);
    const coverPaths = await generateImage(coverSvg, `cover-${fields.slug}`);

    const album = await prisma.album.create({
      data: {
        ...fields,
        published: true,
        coverImage: coverPaths.display,
      },
    });

    console.log(`Album: ${album.title} (Cover: ${coverSize.width}×${coverSize.height})`);

    for (let i = 0; i < artworks.length; i++) {
      const art = artworks[i];
      const slug = art.title
        .toLowerCase()
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const svg = generateSvg(art.width, art.height, palette, fields.sortOrder * 1000 + (i + 1) * 100);
      const paths = await generateImage(svg, `${fields.slug}-${slug}`);

      await prisma.artwork.create({
        data: {
          title: art.title,
          slug,
          imagePath: paths.display,
          thumbPath: paths.thumb,
          sortOrder: i,
          published: true,
          albumId: album.id,
          dimensions: `${art.width} × ${art.height} px`,
          medium: "Generiertes Testbild",
          createdDate: "2026",
        },
      });

      console.log(`  ${art.title} (${art.width}×${art.height})`);
    }
  }

  console.log("\nDone! Created 4 test albums with varied aspect ratios.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
