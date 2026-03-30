import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create pages
  const pages = [
    { key: "home", title: "Startseite", content: "", heroTitle: "Kunstobjekte & Fotografie", heroSubtitle: "Zeitgenössische Werke von Michael Hein", heroImage: "" },
    { key: "about", title: "Über mich", content: "Michael Hein ist ein zeitgenössischer Künstler, der sich auf Kunstobjekte und Fotografie spezialisiert hat." },
    { key: "impressum", title: "Impressum", content: "Michael Hein\nMusterstraße 1\n12345 Musterstadt\nDeutschland" },
    { key: "datenschutz", title: "Datenschutz", content: "## Datenschutzerklärung\n\nDiese Website erhebt keine personenbezogenen Daten. Es werden keine Cookies gesetzt, außer technisch notwendige Session-Cookies im Admin-Bereich." },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { key: page.key },
      update: page,
      create: page,
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
