import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_ORIGINAL = path.join(PUBLIC_DIR, "uploads", "original");
const UPLOAD_DISPLAY = path.join(PUBLIC_DIR, "uploads", "display");
const UPLOAD_THUMB = path.join(PUBLIC_DIR, "uploads", "thumb");

// Ensure directories exist
for (const dir of [UPLOAD_ORIGINAL, UPLOAD_DISPLAY, UPLOAD_THUMB]) {
  fs.mkdirSync(dir, { recursive: true });
}

// Abstract art SVG generator
function generateArtSvg(opts: {
  width: number;
  height: number;
  palette: string[];
  seed: number;
  style: "geometric" | "gradient" | "organic" | "minimal" | "texture";
}): string {
  const { width, height, palette, seed, style } = opts;
  const r = (n: number) => ((seed * 9301 + 49297) % 233280) / 233280 * n;

  const elements: string[] = [];

  if (style === "geometric") {
    // Abstract geometric composition
    elements.push(`<rect width="${width}" height="${height}" fill="${palette[0]}"/>`);
    for (let i = 0; i < 6; i++) {
      const x = r(width) + i * 40;
      const y = r(height) + i * 30;
      const w = 80 + r(300);
      const h = 80 + r(300);
      const rotation = r(45);
      elements.push(
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${palette[(i + 1) % palette.length]}" opacity="${0.5 + r(0.5)}" transform="rotate(${rotation} ${x + w/2} ${y + h/2})"/>`
      );
    }
    // Accent lines
    for (let i = 0; i < 3; i++) {
      elements.push(
        `<line x1="${r(width)}" y1="${r(height)}" x2="${r(width)}" y2="${r(height)}" stroke="${palette[palette.length - 1]}" stroke-width="${1 + r(3)}" opacity="0.6"/>`
      );
    }
  } else if (style === "gradient") {
    // Soft gradient composition
    elements.push(`
      <defs>
        <linearGradient id="bg${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette[0]}"/>
          <stop offset="50%" stop-color="${palette[1]}"/>
          <stop offset="100%" stop-color="${palette[2] || palette[0]}"/>
        </linearGradient>
        <radialGradient id="orb${seed}" cx="50%" cy="50%">
          <stop offset="0%" stop-color="${palette[palette.length - 1]}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${palette[palette.length - 1]}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg${seed})"/>
    `);
    for (let i = 0; i < 4; i++) {
      const cx = r(width);
      const cy = r(height);
      const radius = 100 + r(250);
      elements.push(
        `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#orb${seed})" opacity="${0.3 + r(0.4)}"/>`
      );
    }
  } else if (style === "organic") {
    // Organic flowing shapes
    elements.push(`<rect width="${width}" height="${height}" fill="${palette[0]}"/>`);
    for (let i = 0; i < 5; i++) {
      const cx = width * 0.2 + r(width * 0.6);
      const cy = height * 0.2 + r(height * 0.6);
      const rx = 100 + r(200);
      const ry = 80 + r(180);
      elements.push(
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${palette[(i + 1) % palette.length]}" opacity="${0.4 + r(0.4)}" transform="rotate(${r(180)} ${cx} ${cy})"/>`
      );
    }
  } else if (style === "minimal") {
    // Minimal composition
    elements.push(`<rect width="${width}" height="${height}" fill="${palette[0]}"/>`);
    const blockW = width * 0.4 + r(width * 0.2);
    const blockH = height * 0.3 + r(height * 0.3);
    const blockX = r(width * 0.3);
    const blockY = r(height * 0.3);
    elements.push(`<rect x="${blockX}" y="${blockY}" width="${blockW}" height="${blockH}" fill="${palette[1]}"/>`);
    if (palette[2]) {
      elements.push(
        `<rect x="${blockX + blockW * 0.6}" y="${blockY + blockH * 0.5}" width="${blockW * 0.5}" height="${blockH * 0.6}" fill="${palette[2]}" opacity="0.7"/>`
      );
    }
  } else {
    // Texture - dense small elements
    elements.push(`<rect width="${width}" height="${height}" fill="${palette[0]}"/>`);
    for (let i = 0; i < 60; i++) {
      const x = r(width);
      const y = r(height);
      const size = 4 + r(20);
      elements.push(
        `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${palette[(i + 1) % palette.length]}" opacity="${0.15 + r(0.4)}" transform="rotate(${r(90)} ${x} ${y})"/>`
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${elements.join("")}</svg>`;
}

// Profile image SVG (abstract portrait silhouette)
function generateProfileSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <defs>
      <linearGradient id="pbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e4e9ea"/>
        <stop offset="100%" stop-color="#d4dbdd"/>
      </linearGradient>
    </defs>
    <rect width="800" height="1000" fill="url(#pbg)"/>
    <ellipse cx="400" cy="340" rx="140" ry="170" fill="#adb3b4" opacity="0.6"/>
    <ellipse cx="400" cy="750" rx="240" ry="280" fill="#adb3b4" opacity="0.4"/>
    <rect x="200" y="800" width="400" height="200" fill="#adb3b4" opacity="0.2"/>
  </svg>`;
}

async function generateImage(
  svgString: string,
  baseName: string,
  originalWidth: number = 1600,
  originalHeight: number = 1200
): Promise<{ original: string; display: string; thumb: string }> {
  const originalPath = `/uploads/original/${baseName}.webp`;
  const displayPath = `/uploads/display/${baseName}.webp`;
  const thumbPath = `/uploads/thumb/${baseName}.webp`;

  const svgBuffer = Buffer.from(svgString);

  // Generate original
  await sharp(svgBuffer)
    .resize(originalWidth, originalHeight, { fit: "cover" })
    .webp({ quality: 90 })
    .toFile(path.join(PUBLIC_DIR, originalPath));

  // Generate display (1200px wide)
  await sharp(svgBuffer)
    .resize(1200, null, { withoutEnlargement: false })
    .webp({ quality: 85 })
    .toFile(path.join(PUBLIC_DIR, displayPath));

  // Generate thumbnail (400px wide)
  await sharp(svgBuffer)
    .resize(400, null, { withoutEnlargement: false })
    .webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, thumbPath));

  return { original: originalPath, display: displayPath, thumb: thumbPath };
}

// Color palettes per album
const PALETTES = {
  lichtspiele: ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#533483"],
  strukturen: ["#2d3435", "#5a6061", "#adb3b4", "#e4e9ea", "#665e4c"],
  metamorphose: ["#4a2c2a", "#854442", "#be9b7b", "#3c2415", "#d4a574"],
  stille: ["#2c3e50", "#34495e", "#7f8c8d", "#bdc3c7", "#ecf0f1"],
  fragmente: ["#1b1b1b", "#333333", "#666666", "#999999", "#cccccc"],
};

const STYLES: Array<"geometric" | "gradient" | "organic" | "minimal" | "texture"> = [
  "geometric", "gradient", "organic", "minimal", "texture",
];

async function main() {
  console.log("Cleaning existing data...");
  await prisma.artwork.deleteMany();
  await prisma.album.deleteMany();
  await prisma.page.deleteMany();

  console.log("Generating placeholder images...");

  // Generate profile image
  const profileSvg = generateProfileSvg();
  const profilePaths = await generateImage(profileSvg, "profilbild", 800, 1000);

  // === PAGES ===
  console.log("Creating pages...");

  const pages = [
    {
      key: "home",
      title: "Startseite",
      content: "",
      heroTitle: "Kunstobjekte &",
      heroSubtitle: "Fotografie",
      heroImage: "",
    },
    {
      key: "about",
      title: "Über mich",
      content: `Michael Hein ist ein zeitgenössischer Künstler, der in der Tradition des materialbewussten Schaffens arbeitet. Seine Kunstobjekte und fotografischen Arbeiten entstehen aus einer tiefen Auseinandersetzung mit Form, Material und Licht.

Seit über zwanzig Jahren erforscht er die Grenzen zwischen skulpturaler Arbeit und fotografischer Dokumentation. Seine Werke bewegen sich im Spannungsfeld zwischen Abstraktion und konkreter Materialität — zwischen dem, was sichtbar ist, und dem, was sich erst im stillen Betrachten offenbart.

In seinen Kunstobjekten verbindet Hein industrielle Materialien mit organischen Formen. Holz, Metall und Stein werden zu Trägern einer visuellen Sprache, die von Reduktion und Präzision geprägt ist. Jedes Objekt entsteht in einem langsamen, iterativen Prozess, bei dem das Material selbst den Weg weist.

Seine fotografischen Arbeiten sind keine bloßen Abbildungen, sondern eigenständige Kompositionen. Sie fangen Momente ein, in denen das Licht die Oberflächen transformiert — in denen das Gewöhnliche eine stille Intensität gewinnt. Die Arbeiten wurden in Einzel- und Gruppenausstellungen in Deutschland und Europa gezeigt.

Michael Hein lebt und arbeitet in Süddeutschland. Sein Atelier ist ein Ort der Konzentration — ein Raum, in dem die Stille zwischen den Dingen hörbar wird.`,
      heroImage: profilePaths.display,
    },
    {
      key: "impressum",
      title: "Impressum",
      content: `Michael Hein
Kunstobjekte & Fotografie

Musterstraße 42
78462 Konstanz
Deutschland

Telefon: +49 (0) 7531 123456
E-Mail: info@michael-hein.de

Umsatzsteuer-ID: DE123456789

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
Michael Hein, Anschrift wie oben`,
    },
    {
      key: "datenschutz",
      title: "Datenschutz",
      content: `## Datenschutzerklärung

Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).

## Kontakt mit uns

Wenn Sie per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.

## Cookies

Diese Website verwendet keine Tracking-Cookies. Im Administrationsbereich werden technisch notwendige Session-Cookies verwendet, die nach Beendigung der Sitzung automatisch gelöscht werden.

## Server-Logfiles

Der Provider dieser Website erhebt und speichert automatisch Informationen in Server-Logfiles, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners sowie die Uhrzeit der Serveranfrage.

## Ihre Rechte

Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei der Aufsichtsbehörde beschweren.`,
    },
  ];

  for (const page of pages) {
    await prisma.page.create({ data: page });
  }

  // === ALBUMS & ARTWORKS ===
  console.log("Creating albums and artworks...");

  const albumsData = [
    {
      title: "Lichtspiele",
      slug: "lichtspiele",
      description: "Fotografische Arbeiten, die das Wechselspiel von Licht und Schatten auf unterschiedlichen Oberflächen einfangen.",
      sortOrder: 1,
      published: true,
      palette: PALETTES.lichtspiele,
      artworks: [
        { title: "Reflexion I", medium: "Fotografie, Pigmentdruck auf Hahnemühle", dimensions: "60 × 80 cm", createdDate: "2023", description: "Die erste Arbeit der Serie untersucht die Brechung von Tageslicht auf poliertem Stahl. Das resultierende Bild oszilliert zwischen geometrischer Klarheit und organischer Auflösung." },
        { title: "Durchlässig", medium: "Fotografie, Pigmentdruck", dimensions: "50 × 70 cm", createdDate: "2023", description: "Licht durchdringt eine transluzente Membran und erzeugt dabei ein Spektrum von Zwischentönen, die an abstrakte Malerei erinnern." },
        { title: "Schattenfall", medium: "Fotografie, Fine Art Print", dimensions: "80 × 60 cm", createdDate: "2022", description: "Scharf gezogene Schatten auf einer Betonfläche — eine Studie über die Vergänglichkeit natürlicher Lichtzeichnungen." },
        { title: "Nachtleuchten", medium: "Fotografie, Pigmentdruck auf Baryta", dimensions: "70 × 100 cm", createdDate: "2022", description: "Langzeitbelichtung städtischer Lichtquellen. Die Bewegung der Zeit wird sichtbar in den Spuren, die das Licht auf dem Sensor hinterlässt." },
        { title: "Morgengrau", medium: "Fotografie, Pigmentdruck", dimensions: "60 × 90 cm", createdDate: "2024", description: "Das diffuse Licht der frühen Morgenstunden taucht eine Industrielandschaft in monochrome Weichheit." },
      ],
    },
    {
      title: "Strukturen",
      slug: "strukturen",
      description: "Kunstobjekte aus Holz, Metall und Stein. Jedes Werk ist eine Untersuchung von Oberfläche, Textur und materieller Präsenz.",
      sortOrder: 2,
      published: true,
      palette: PALETTES.strukturen,
      artworks: [
        { title: "Schichtung No. 7", medium: "Eiche, Stahl", dimensions: "40 × 30 × 15 cm", createdDate: "2024", description: "Sieben Lagen geölter Eiche, getrennt durch oxidierte Stahlplatten. Das Objekt verändert seine Erscheinung je nach Blickwinkel und Lichteinfall." },
        { title: "Erosion", medium: "Sandstein, geschliffen", dimensions: "35 × 25 × 20 cm", createdDate: "2023", description: "Ein Sandsteinblock, dessen Oberfläche durch kontrolliertes Schleifen eine Landschaft aus Graten und Tälern offenbart." },
        { title: "Faltung", medium: "Cortenstahl", dimensions: "50 × 40 × 8 cm", createdDate: "2023", description: "Eine gefaltete Cortenstahlplatte, deren Patina über Monate im Freien gewachsen ist. Die Rostschicht wird zum integralen Teil der Komposition." },
        { title: "Verdichtung", medium: "Beton, Pigment", dimensions: "25 × 25 × 25 cm", createdDate: "2024", description: "Ein kubisches Betonobjekt mit eingeschlossenen Farbpigmenten. Beim Brechen der Oberfläche werden verborgene Schichten sichtbar." },
      ],
    },
    {
      title: "Metamorphose",
      slug: "metamorphose",
      description: "Arbeiten im Übergang — Werke, die den Moment der Verwandlung zwischen zwei Zuständen festhalten.",
      sortOrder: 3,
      published: true,
      palette: PALETTES.metamorphose,
      artworks: [
        { title: "Übergang I", medium: "Mixed Media auf Leinwand", dimensions: "120 × 90 cm", createdDate: "2024", description: "Erdpigmente und Asche auf grober Leinwand. Die Arbeit thematisiert den Kreislauf von Zerfall und Erneuerung." },
        { title: "Asche und Gold", medium: "Holzasche, Blattgold auf Holz", dimensions: "80 × 60 cm", createdDate: "2023", description: "Ein Dialog zwischen Vergänglichkeit und Beständigkeit. Die Holzasche wird zum Bildträger, das Gold zum leuchtenden Akzent." },
        { title: "Sediment", medium: "Lehm, Sand, Leinöl", dimensions: "100 × 100 cm", createdDate: "2023", description: "Natürliche Materialien, geschichtet und getrocknet. Die während des Trocknungsprozesses entstehenden Risse werden Teil des Werks." },
        { title: "Wandlung", medium: "Eisen, Wachs", dimensions: "45 × 30 × 12 cm", createdDate: "2022", description: "Ein Eisenobjekt, teilweise in Bienenwachs eingebettet. Die Wärme des Betrachterraums verändert die Form des Wachses über Zeit." },
        { title: "Patina", medium: "Kupfer, Essig, Zeit", dimensions: "60 × 40 cm", createdDate: "2024", description: "Eine Kupferplatte, deren Grünspan durch gezielte Behandlung mit Essigdampf entsteht. Jedes Exemplar ist ein Unikat der Chemie." },
        { title: "Spuren", medium: "Papier, Tusche, Feuer", dimensions: "70 × 50 cm", createdDate: "2024", description: "Handgeschöpftes Papier, beschrieben mit Tusche und an den Rändern vom Feuer gezeichnet. Die Flamme als Co-Autorin." },
      ],
    },
    {
      title: "Stille Momente",
      slug: "stille-momente",
      description: "Landschaftsfotografien, die Orte der Ruhe und Kontemplation zeigen — Räume, in denen die Zeit stillzustehen scheint.",
      sortOrder: 4,
      published: true,
      palette: PALETTES.stille,
      artworks: [
        { title: "Nebelmeer", medium: "Fotografie, Pigmentdruck auf Hahnemühle", dimensions: "100 × 70 cm", createdDate: "2024", description: "Ein Blick über ein Nebelmeer im Schwarzwald. Die Baumwipfel ragen wie Inseln aus dem weißen Dunst." },
        { title: "Uferzone", medium: "Fotografie, Fine Art Print", dimensions: "80 × 60 cm", createdDate: "2023", description: "Steine am Bodenseeufer, von jahrtausendelanger Erosion geglättet. Das Wasser umspielt sie in endloser Wiederholung." },
        { title: "Winterstille", medium: "Fotografie, Pigmentdruck", dimensions: "90 × 60 cm", createdDate: "2023", description: "Ein einzelner Baum in einer verschneiten Ebene. Die Reduktion auf wenige Bildelemente erzeugt eine meditative Qualität." },
        { title: "Dämmerung", medium: "Fotografie, Pigmentdruck auf Baryta", dimensions: "70 × 100 cm", createdDate: "2022", description: "Die blaue Stunde über dem Hegau. Vulkankegel zeichnen sich als dunkle Silhouetten gegen den verlöschenden Himmel ab." },
      ],
    },
    {
      title: "Fragmente",
      slug: "fragmente",
      description: "Eine Serie von Skulpturen und Objekten, die das Unvollständige als eigenständige ästhetische Qualität begreifen.",
      sortOrder: 5,
      published: true,
      palette: PALETTES.fragmente,
      artworks: [
        { title: "Bruchstück No. 1", medium: "Marmor, gebrochen", dimensions: "30 × 20 × 18 cm", createdDate: "2024", description: "Ein Marmorblock, dessen eine Hälfte poliert, die andere roh belassen ist. Die Bruchkante wird zur Hauptsache." },
        { title: "Leerstelle", medium: "Stahl, geschweißt", dimensions: "60 × 40 × 10 cm", createdDate: "2023", description: "Ein Stahlrahmen, der einen leeren Raum umschließt. Die Abwesenheit wird zum eigentlichen Bildinhalt." },
        { title: "Torso", medium: "Gips, Pigment", dimensions: "45 × 25 × 20 cm", createdDate: "2023", description: "Eine fragmentierte Form, die an antike Skulpturen erinnert. Die Unvollständigkeit eröffnet dem Betrachter Raum für eigene Ergänzungen." },
        { title: "Rest", medium: "Fundholz, Nägel", dimensions: "55 × 15 × 12 cm", createdDate: "2024", description: "Ein vom Wasser geformtes Treibholz, durchzogen von verrosteten Nägeln. Natur und Menschenwerk in stiller Koexistenz." },
        { title: "Auflösung", medium: "Porzellan, zerbrochen und rekonstruiert", dimensions: "20 × 20 × 20 cm", createdDate: "2024", description: "Ein Porzellangefäß, absichtlich zerbrochen und mit sichtbaren goldenen Fugen wieder zusammengesetzt — inspiriert von der japanischen Kintsugi-Tradition." },
      ],
    },
  ];

  for (const albumData of albumsData) {
    const { artworks: artworksData, palette, ...albumFields } = albumData;

    // Generate cover image
    const coverSvg = generateArtSvg({
      width: 1600,
      height: 1200,
      palette,
      seed: albumFields.sortOrder * 1000,
      style: STYLES[albumFields.sortOrder % STYLES.length],
    });
    const coverPaths = await generateImage(coverSvg, `cover-${albumFields.slug}`);

    const album = await prisma.album.create({
      data: {
        ...albumFields,
        coverImage: coverPaths.display,
      },
    });

    console.log(`  Album: ${album.title}`);

    for (let i = 0; i < artworksData.length; i++) {
      const artworkData = artworksData[i];
      const slug = artworkData.title
        .toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Generate artwork image
      const artSvg = generateArtSvg({
        width: 1600,
        height: 1200,
        palette,
        seed: albumFields.sortOrder * 1000 + (i + 1) * 100,
        style: STYLES[(albumFields.sortOrder + i) % STYLES.length],
      });
      const artPaths = await generateImage(
        artSvg,
        `${albumFields.slug}-${slug}`,
        1600,
        1200
      );

      await prisma.artwork.create({
        data: {
          title: artworkData.title,
          slug,
          description: artworkData.description,
          dimensions: artworkData.dimensions,
          medium: artworkData.medium,
          createdDate: artworkData.createdDate,
          imagePath: artPaths.display,
          thumbPath: artPaths.thumb,
          sortOrder: i,
          published: true,
          albumId: album.id,
        },
      });

      console.log(`    Artwork: ${artworkData.title}`);
    }
  }

  console.log("\nSeed completed successfully!");
  console.log(`  ${albumsData.length} albums created`);
  console.log(`  ${albumsData.reduce((acc, a) => acc + a.artworks.length, 0)} artworks created`);
  console.log(`  4 pages created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
