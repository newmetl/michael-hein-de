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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import Image from "next/image";

type Artwork = {
  id: string;
  title: string;
  imagePath: string;
  thumbPath: string | null;
};

type AlbumOption = {
  id: string;
  title: string;
};

function SortableArtworkItem({
  artwork,
  albumId,
  coverImage,
  albums,
  onSetCover,
  onDelete,
  onMove,
}: {
  artwork: Artwork;
  albumId: string;
  coverImage: string | null;
  albums: AlbumOption[];
  onSetCover: (imagePath: string) => void;
  onDelete: (id: string) => void;
  onMove: (artworkId: string, targetAlbumId: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isCover = coverImage === (artwork.thumbPath || artwork.imagePath);

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className="relative aspect-square bg-surface-container-low overflow-hidden">
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing bg-inverse-surface/60 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Zum Sortieren ziehen"
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <Image
          src={artwork.thumbPath || artwork.imagePath}
          alt={artwork.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {isCover && (
          <span className="absolute top-2 left-2 bg-secondary text-on-secondary px-2 py-1 text-[10px] uppercase tracking-widest">
            Cover
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-headline text-sm truncate">{artwork.title}</h3>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Link
            href={`/admin/alben/${albumId}/werke/${artwork.id}`}
            className="text-[10px] tracking-widest uppercase border border-outline/20 px-3 py-1 hover:bg-surface-container-low transition-all"
          >
            Bearbeiten
          </Link>
          <button
            type="button"
            onClick={() =>
              onSetCover(artwork.thumbPath || artwork.imagePath)
            }
            className="text-[10px] tracking-widest uppercase border border-outline/20 px-3 py-1 hover:bg-surface-container-low transition-all"
          >
            Als Cover
          </button>
          {albums.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMove(!showMove)}
              className="text-[10px] tracking-widest uppercase border border-outline/20 px-3 py-1 hover:bg-surface-container-low transition-all"
            >
              Verschieben
            </button>
          )}
          {confirmDelete ? (
            <span className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  onDelete(artwork.id);
                  setConfirmDelete(false);
                }}
                className="text-[10px] tracking-widest uppercase bg-error text-on-primary px-3 py-1 transition-all"
              >
                Bestätigen
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-[10px] tracking-widest uppercase border border-outline/20 px-3 py-1 hover:bg-surface-container-low transition-all"
              >
                Abbrechen
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-[10px] tracking-widest uppercase border border-error/20 text-error px-3 py-1 hover:bg-error/5 transition-all"
            >
              Löschen
            </button>
          )}
        </div>
        {showMove && (
          <div className="mt-2 flex flex-wrap gap-1">
            {albums.map((album) => (
              <button
                key={album.id}
                type="button"
                onClick={() => {
                  onMove(artwork.id, album.id);
                  setShowMove(false);
                }}
                className="text-[10px] tracking-widest uppercase bg-surface-container-low px-3 py-1 hover:bg-surface-container transition-all"
              >
                {album.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SortableArtworkGrid({
  initialArtworks,
  albumId,
  coverImage,
  otherAlbums,
}: {
  initialArtworks: Artwork[];
  albumId: string;
  coverImage: string | null;
  otherAlbums: AlbumOption[];
}) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [currentCover, setCurrentCover] = useState(coverImage);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = artworks.findIndex((a) => a.id === active.id);
    const newIndex = artworks.findIndex((a) => a.id === over.id);
    const newArtworks = arrayMove(artworks, oldIndex, newIndex);
    setArtworks(newArtworks);

    await fetch("/api/admin/artworks/sort", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: newArtworks.map((a) => a.id) }),
    });
  }

  async function handleSetCover(imagePath: string) {
    setCurrentCover(imagePath);
    await fetch(`/api/admin/albums/${albumId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImage: imagePath }),
    });
  }

  async function handleDelete(id: string) {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
  }

  async function handleMove(artworkId: string, targetAlbumId: string) {
    setArtworks((prev) => prev.filter((a) => a.id !== artworkId));
    await fetch(`/api/admin/artworks/${artworkId}/move`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ albumId: targetAlbumId }),
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={artworks.map((a) => a.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <SortableArtworkItem
              key={artwork.id}
              artwork={artwork}
              albumId={albumId}
              coverImage={currentCover}
              albums={otherAlbums}
              onSetCover={handleSetCover}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
