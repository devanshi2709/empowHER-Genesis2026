/**
 * middleware/logger.ts
 * ─────────────────────────────────────────────────────────────
 * Request logger — logs method, path, status, and duration for
 * every request. Extra events (file uploads, AI responses,
 * storage saves) are logged directly in routes/services but
 * this middleware provides the baseline request trail.
 */

import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, path } = req;

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${path} → ${res.statusCode} (${ms}ms)`);
  });

  next();
}
