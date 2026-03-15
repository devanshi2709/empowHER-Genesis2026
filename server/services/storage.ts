/**
 * Image Storage Service (services/storage.ts)
 * ─────────────────────────────────────────────────────────────
 * Abstracts file storage so scan.ts never touches the filesystem directly.
 * Currently saves locally to /uploads; swap uploadImage() later for IBM COS
 * without changing any route code.
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolves to <project-root>/uploads regardless of where this file lives
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

/**
 * uploadImage(file)
 * Multer has already written the file to disk by the time routes call this.
 * This function just returns a structured record so routes have a single
 * source of truth for what was stored.
 */
export function uploadImage(file: Express.Multer.File): { filename: string; mimetype: string; size: number; localPath: string } {
  return {
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    localPath: path.join(UPLOADS_DIR, file.filename),
  };
}

/**
 * getImageUrl(filename)
 * Returns the URL path the frontend can use to retrieve the image.
 * When IBM COS is added, return a presigned URL here instead.
 */
export function getImageUrl(filename: string): string {
  return `/uploads/${filename}`;
}
