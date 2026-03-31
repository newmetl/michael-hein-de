"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import Image from "next/image";

type Album = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  published: boolean;
  _count: { artworks: number };
};

function SortableAlbumItem({
  album,
  onTogglePublish,
  onDelete,
}: {
  album: Album;
  onTogglePublish: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface-container-lowest p-6 flex items-center gap-6"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-on-surface-variant/50 hover:text-on-surface-variant transition-colors flex-shrink-0"
        title="Zum Sortieren ziehen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div className="w-20 h-20 bg-surface-container-low flex-shrink-0 relative overflow-hidden">
        {album.coverImage ? (
          <Image
            src={album.coverImage}
            alt={album.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-grow">
        <h3 className="font-headline text-xl">{album.title}</h3>
        <p className="text-sm text-on-surface-variant">
          {album._count.artworks} Werke &middot; /{album.slug}
        </p>
      </div>

      <span
        className={`px-3 py-1 text-[10px] tracking-widest uppercase ${
          album.published
            ? "text-secondary bg-secondary/10"
            : "text-on-surface-variant bg-surface-container-low"
        }`}
      >
        {album.published ? "Veröffentlicht" : "Entwurf"}
      </span>

      <div className="flex gap-2">
        <Link
          href={`/admin/alben/${album.id}/werke`}
          className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
        >
          Werke
        </Link>
        <Link
          href={`/admin/alben/${album.id}`}
          className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
        >
          Bearbeiten
        </Link>
        <button
          type="button"
          onClick={() => onTogglePublish(album.id)}
          className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
        >
          {album.published ? "Entwurf" : "Publizieren"}
        </button>
        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                onDelete(album.id);
                setConfirmDelete(false);
              }}
              className="px-4 py-2 text-xs tracking-widest uppercase bg-error text-on-primary transition-all"
            >
              Bestätigen
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-xs tracking-widest uppercase border border-outline/20 hover:bg-surface-container-low transition-all"
            >
              Abbrechen
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 text-xs tracking-widest uppercase border border-error/20 text-error hover:bg-error/5 transition-all"
          >
            Löschen
          </button>
        )}
      </div>
    </div>
  );
}

export default function SortableAlbumList({
  initialAlbums,
}: {
  initialAlbums: Album[];
}) {
  const [albums, setAlbums] = useState(initialAlbums);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = albums.findIndex((a) => a.id === active.id);
    const newIndex = albums.findIndex((a) => a.id === over.id);
    const newAlbums = arrayMove(albums, oldIndex, newIndex);
    setAlbums(newAlbums);

    await fetch("/api/admin/albums/sort", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: newAlbums.map((a) => a.id) }),
    });
  }

  async function handleTogglePublish(id: string) {
    setAlbums((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, published: !a.published } : a
      )
    );
    await fetch(`/api/admin/albums/${id}/toggle-publish`, { method: "PUT" });
  }

  async function handleDelete(id: string) {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/admin/albums/${id}`, { method: "DELETE" });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={albums.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {albums.map((album) => (
            <SortableAlbumItem
              key={album.id}
              album={album}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
