import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
};

export default async function DatenschutzPage() {
  const page = await prisma.page.findUnique({ where: { key: "datenschutz" } });

  return (
    <div className="px-6 md:px-12 max-w-3xl mx-auto">
      <h1 className="font-headline text-4xl md:text-5xl tracking-editorial text-on-background mb-16">
        Datenschutz
      </h1>
      <div className="space-y-4">
        {page?.content?.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="font-headline text-2xl text-on-background mt-14 mb-6">
                {line.replace("## ", "")}
              </h2>
            );
          }
          return (
            <p key={i} className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed">
              {line || <br />}
            </p>
          );
        })}
      </div>
    </div>
  );
}
