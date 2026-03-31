import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PAGES = [
  {
    key: "home",
    title: "Startseite",
    content: "",
    heroTitle: "Kunstobjekte &",
    heroSubtitle: "Fotografie",
  },
  {
    key: "about",
    title: "Über mich",
    content: "",
  },
  {
    key: "impressum",
    title: "Impressum",
    content: "",
  },
  {
    key: "datenschutz",
    title: "Datenschutz",
    content: "",
  },
];

try {
  for (const page of DEFAULT_PAGES) {
    const existing = await prisma.page.findUnique({ where: { key: page.key } });
    if (!existing) {
      await prisma.page.create({ data: page });
      console.log(`Created page: ${page.key}`);
    }
  }
  console.log("Pages ensured.");
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
