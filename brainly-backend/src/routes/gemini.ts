import express from "express";
import { requireGeminiApiKey } from "../environment";
// If your Node runtime has global fetch (Node 18+), this works; otherwise install node-fetch/undici and import it.
const router = express.Router();

router.post("/api/gemini", async (req, res) => {
  try {
    // candidate key can come from header 'x-api-key' or request body
    const headerKey = (req.headers["x-api-key"] as string) || undefined;
    const bodyKey = req.body?.apiKey;
    const candidateKey = headerKey || bodyKey;

    // will throw a clear error if neither user key nor server key exist
    const apiKey = requireGeminiApiKey(candidateKey);

    const prompt = req.body?.prompt;
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt in request body" });
      return;
    }

    // Replace this URL with your actual Gemini endpoint & payload shape.
    const GEMINI_ENDPOINT =
      process.env.GEMINI_API_URL ||
      "https://api.gemini.your-provider/v1/complete";

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }), // adapt to real Gemini request schema
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: `Upstream error: ${text}` });
    }

    const data = await response.json();
    // forward upstream response body
    res.json({ data });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || "Unknown error" });
  }
});

export default router;
