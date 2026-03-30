import slugify from "slugify";

export function generateSlug(title: string): string {
  const replacements: Record<string, string> = {
    ä: "ae", ö: "oe", ü: "ue", Ä: "Ae", Ö: "Oe", Ü: "Ue", ß: "ss",
  };
  let processed = title;
  for (const [key, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(key, "g"), value);
  }
  return slugify(processed, { lower: true, strict: true });
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
