-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artwork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "width" TEXT,
    "height" TEXT,
    "depth" TEXT,
    "dimensions" TEXT,
    "medium" TEXT,
    "createdDate" TEXT,
    "imagePath" TEXT NOT NULL,
    "thumbPath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Artwork_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Artwork" ("albumId", "createdAt", "createdDate", "depth", "description", "dimensions", "height", "id", "imagePath", "medium", "published", "slug", "sortOrder", "thumbPath", "title", "updatedAt", "width") SELECT "albumId", "createdAt", "createdDate", "depth", "description", "dimensions", "height", "id", "imagePath", "medium", "published", "slug", "sortOrder", "thumbPath", "title", "updatedAt", "width" FROM "Artwork";
DROP TABLE "Artwork";
ALTER TABLE "new_Artwork" RENAME TO "Artwork";
CREATE UNIQUE INDEX "Artwork_slug_key" ON "Artwork"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
