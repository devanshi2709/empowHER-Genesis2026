import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Endpoint initialized" });
});

router.post("/", (req: Request, res: Response) => {
  const { prompt } = req.body as { prompt?: string };
  res.json({ success: true, message: "Endpoint initialized", prompt: prompt ?? null, response: null });
});

export default router;
