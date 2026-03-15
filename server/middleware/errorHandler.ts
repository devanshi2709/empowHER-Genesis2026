/**
 * middleware/errorHandler.ts
 * ─────────────────────────────────────────────────────────────
 * Global error handler — catches any error thrown or passed via
 * next(err) in any route and normalises it to:
 * { success: false, error: "Descriptive message" }
 *
 * Must be registered AFTER all routes in index.ts (Express
 * identifies it as an error handler by its 4-argument signature).
 */

import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ success: false, error: err.message || "Internal server error" });
}
