import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export async function processImage(file: File): Promise<{
  originalPath: string;
  displayPath: string;
  thumbPath: string;
}> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-");
  const fileName = `${timestamp}-${baseName}`;

  // Ensure directories exist
  await fs.mkdir(path.join(UPLOAD_DIR, "original"), { recursive: true });
  await fs.mkdir(path.join(UPLOAD_DIR, "display"), { recursive: true });
  await fs.mkdir(path.join(UPLOAD_DIR, "thumb"), { recursive: true });

  // Save original
  const originalExt = path.extname(file.name) || ".jpg";
  const originalFilename = `${fileName}${originalExt}`;
  await fs.writeFile(path.join(UPLOAD_DIR, "original", originalFilename), buffer);

  // Generate display version (1200px wide, WebP)
  const displayFilename = `${fileName}.webp`;
  await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(UPLOAD_DIR, "display", displayFilename));

  // Generate thumbnail (400px wide, WebP)
  const thumbFilename = `${fileName}.webp`;
  await sharp(buffer)
    .resize(400, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(UPLOAD_DIR, "thumb", thumbFilename));

  return {
    originalPath: `/api/uploads/original/${originalFilename}`,
    displayPath: `/api/uploads/display/${displayFilename}`,
    thumbPath: `/api/uploads/thumb/${thumbFilename}`,
  };
}

export async function deleteImage(imagePath: string) {
  const baseName = path.basename(imagePath, path.extname(imagePath));
  const dirs = ["original", "display", "thumb"];
  for (const dir of dirs) {
    const dirPath = path.join(UPLOAD_DIR, dir);
    try {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        if (file.startsWith(baseName.replace(/\.[^/.]+$/, ""))) {
          await fs.unlink(path.join(dirPath, file));
        }
      }
    } catch {
      // Directory may not exist
    }
  }
}
