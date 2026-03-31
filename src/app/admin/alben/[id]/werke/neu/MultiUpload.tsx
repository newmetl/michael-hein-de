"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type UploadItem = {
  file: File;
  preview: string;
  title: string;
  status: "pending" | "uploading" | "done" | "error";
};

export default function MultiUpload({ albumId }: { albumId: string }) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: UploadItem[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        status: "pending" as const,
      }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function removeItem(index: number) {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function updateTitle(index: number, title: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item))
    );
  }

  async function uploadAll() {
    setUploading(true);

    for (let i = 0; i < items.length; i++) {
      if (items[i].status === "done") continue;

      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "uploading" } : item
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", items[i].file);
        formData.append("title", items[i].title);
        formData.append("albumId", albumId);

        const res = await fetch("/api/admin/artworks/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload fehlgeschlagen");

        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "done" } : item
          )
        );
      } catch {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "error" } : item
          )
        );
      }
    }

    setUploading(false);
    router.push(`/admin/alben/${albumId}/werke`);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-secondary bg-secondary/5"
            : "border-outline/30 hover:border-outline/60"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-12 h-12 mx-auto mb-4 text-on-surface-variant/40"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="font-label text-sm text-on-surface-variant">
          Bilder hierher ziehen oder klicken zum Auswählen
        </p>
        <p className="text-xs text-on-surface-variant/60 mt-2">
          Mehrere Bilder gleichzeitig möglich
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Preview Grid */}
      {items.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div key={index} className="relative">
                <div className="relative aspect-square bg-surface-container-low overflow-hidden">
                  <Image
                    src={item.preview}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 bg-inverse-surface/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {item.status === "done" && (
                    <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-8 h-8 text-secondary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                  )}
                  {item.status === "error" && (
                    <div className="absolute inset-0 bg-error/20 flex items-center justify-center">
                      <span className="text-error text-xs font-label uppercase tracking-widest">
                        Fehler
                      </span>
                    </div>
                  )}
                  {item.status === "pending" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(index);
                      }}
                      className="absolute top-2 right-2 bg-inverse-surface/60 text-white p-1 hover:bg-inverse-surface transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <input
                  value={item.title}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  disabled={item.status !== "pending"}
                  className="mt-2 w-full bg-transparent border-0 border-b border-outline/30 py-1 px-0 text-sm focus:ring-0 focus:border-secondary transition-colors disabled:opacity-50"
                  placeholder="Titel"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={uploadAll}
              disabled={uploading || items.every((i) => i.status === "done")}
              className="bg-gradient-to-r from-primary to-primary-dim text-on-primary px-12 py-4 font-label uppercase text-xs tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
            >
              {uploading
                ? `Hochladen (${items.filter((i) => i.status === "done").length}/${items.length})...`
                : `${items.filter((i) => i.status === "pending").length} Bilder hochladen`}
            </button>
            {!uploading && (
              <button
                type="button"
                onClick={() => {
                  items.forEach((i) => URL.revokeObjectURL(i.preview));
                  setItems([]);
                }}
                className="border border-outline/20 text-on-surface px-8 py-4 font-label uppercase text-xs tracking-widest hover:bg-surface-container-low transition-all"
              >
                Alle entfernen
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
