import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

router.post("/", (req: Request, res: Response) => {
  const { scanId, insight } = req.body as { scanId?: string; insight?: string };
  res.json({ success: true, message: "Endpoint initialized", scanId: scanId ?? null, explanation: insight ?? null });
});

export default router;
