"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import Image from "next/image";
import MarkdownEditor from "./MarkdownEditor";

type Page = {
  id: string;
  key: string;
  title: string;
  content: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImage: string | null;
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
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  function handleProfileImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  }

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

      {page.key === "about" && (
        <div className="mb-6">
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Profilbild
          </label>
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-40 bg-surface-container-low overflow-hidden shrink-0">
              {(profilePreview || page.heroImage) ? (
                <Image
                  src={profilePreview || page.heroImage!}
                  alt="Profilbild Vorschau"
                  fill
                  className="object-cover"
                  unoptimized={!!profilePreview}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="block border border-outline px-4 py-2 font-label text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors"
              >
                {page.heroImage ? "Bild ändern" : "Bild hochladen"}
              </button>
              <p className="font-body text-xs text-on-surface-variant">
                JPG oder PNG, wird automatisch optimiert.
              </p>
            </div>
          </div>
        </div>
      )}

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
