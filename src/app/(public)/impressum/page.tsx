import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
};

export default async function ImpressumPage() {
  const page = await prisma.page.findUnique({ where: { key: "impressum" } });

  return (
    <div className="px-6 md:px-12 max-w-3xl mx-auto">
      <h1 className="font-headline text-5xl tracking-tighter text-on-background mb-12">
        Impressum
      </h1>
      <div className="space-y-4">
        {page?.content?.split("\n").map((line, i) => (
          <p key={i} className="font-body text-lg text-on-surface-variant leading-relaxed">
            {line || <br />}
          </p>
        ))}
      </div>
    </div>
  );
}
