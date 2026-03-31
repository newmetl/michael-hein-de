"use client";

import { useTransition, useState, useEffect } from "react";
import MarkdownEditor from "./MarkdownEditor";

type Page = {
  id: string;
  key: string;
  title: string;
  content: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
};

export default function PageForm({
  page,
  label,
  action,
}: {
  page: Page;
  label: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      setShowSuccess(true);
    });
  }

  return (
    <form action={handleSubmit} className="bg-surface-container-lowest p-8">
      <input type="hidden" name="id" value={page.id} />
      <h2 className="font-headline text-xl mb-6">{label}</h2>

      {page.key === "home" && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Hero Titel
            </label>
            <input
              name="heroTitle"
              defaultValue={page.heroTitle || ""}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Hero Untertitel
            </label>
            <input
              name="heroSubtitle"
              defaultValue={page.heroSubtitle || ""}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
          Inhalt (Markdown)
        </label>
        <MarkdownEditor name="content" defaultValue={page.content} />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-8 py-3 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isPending ? "Speichert…" : "Speichern"}
        </button>

        <span
          className={`font-label text-xs tracking-widest text-secondary transition-opacity duration-300 ${
            showSuccess ? "opacity-100" : "opacity-0"
          }`}
        >
          Gespeichert
        </span>
      </div>
    </form>
  );
}
