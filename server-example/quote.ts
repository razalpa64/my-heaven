/* ──────────────────────────────────────────────────────────────
   EXAMPLE serverless function (Vercel style: /api/quote).
   This runs on YOUR server. The AI key lives in the server env
   (process.env.AI_API_KEY) and never reaches the browser.

   Deploy: copy to /api/quote.ts in a Vercel project, set
   AI_API_KEY in the dashboard, point VITE_QUOTE_API_URL at it.
   ────────────────────────────────────────────────────────────── */

import { QUOTE_SYSTEM_PROMPT } from "../src/utils/quotes";

export default async function handler(req: any, res: any) {
  // lock CORS to your own site
  res.setHeader("Access-Control-Allow-Origin", process.env.SITE_ORIGIN ?? "");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const photo = req.body?.photo ?? {};
  const description = [
    photo.title && `Title: ${photo.title}`,
    photo.mood && `Mood: ${photo.mood}`,
    photo.category && `Category: ${photo.category}`,
    photo.caption && `Caption: ${photo.caption}`,
    photo.note && `A note the writer scribbled: ${photo.note}`,
    photo.location && `Location: ${photo.location}`,
    photo.date && `Date: ${photo.date}`
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.AI_API_KEY ?? "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 120,
        system: QUOTE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Write the one quote for this photograph.\n${description}` }]
      })
    });
    const data = await r.json();
    const quote = data?.content?.[0]?.text?.trim();
    if (!quote) throw new Error("empty");
    res.status(200).json({ quote });
  } catch {
    // the frontend falls back gracefully — never break the page
    res.status(502).json({ error: "generation unavailable" });
  }
}
