"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Artwork = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  medium: string | null;
  dimensions: string | null;
  createdDate: string | null;
  imagePath: string;
};

export default function ArtworkEditForm({
  artwork,
  action,
}: {
  artwork: Artwork;
  action: (formData: FormData) => Promise<void>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <>
      <div className="mb-8 bg-surface-container-low p-4">
        <div className="relative aspect-video">
          <Image
            src={preview || artwork.imagePath}
            alt={artwork.title}
            fill
            className="object-contain"
            sizes="600px"
            unoptimized={!!preview}
          />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            form="artwork-form"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border border-outline px-4 py-2 font-label text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            Bild ändern
          </button>
          {preview && (
            <span className="font-label text-xs text-on-surface-variant">
              Neues Bild ausgewählt
            </span>
          )}
        </div>
      </div>

      <form id="artwork-form" action={action} className="space-y-8">
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Titel
          </label>
          <input
            name="title"
            required
            defaultValue={artwork.title}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Slug
          </label>
          <input
            name="slug"
            required
            defaultValue={artwork.slug}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Material / Technik
            </label>
            <input
              name="medium"
              defaultValue={artwork.medium || ""}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              Maße
            </label>
            <input
              name="dimensions"
              defaultValue={artwork.dimensions || ""}
              className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Entstehungsdatum
          </label>
          <input
            name="createdDate"
            defaultValue={artwork.createdDate || ""}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Beschreibung
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={artwork.description || ""}
            className="w-full bg-transparent border-0 border-b border-outline py-2 px-0 focus:ring-0 focus:border-secondary transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-12 py-4 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all"
        >
          Speichern
        </button>
      </form>
    </>
  );
}
