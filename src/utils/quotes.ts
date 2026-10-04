import type { Photo } from "../config/types";

/* ──────────────────────────────────────────────────────────────
   Quote resolution — priority order:
     1. manual quote written in gallery.json      (always wins)
     2. AI-generated quote via your own endpoint  (optional)
     3. local fallback, chosen by mood + stable per photo
   The interface never breaks if AI is unavailable.
   ────────────────────────────────────────────────────────────── */

/* The internal creative brief sent to your AI endpoint. The endpoint
   (a serverless function YOU host, holding the API key server-side)
   should pass this as the system prompt. No keys live in this bundle. */
export const QUOTE_SYSTEM_PROMPT = `You are a thoughtful romantic writer who knows that affection is often hidden inside small observations. You are writing one short line for a private photograph of someone deeply loved, in the voice of the person who kept the photograph.

Rules:
- ONE quote only, usually 1–3 short sentences.
- Emotionally specific, natural, intimate. Poetic but believable.
- React to what is actually described: the expression, the light, the setting, the mood.
- No clichés ("you light up my world"), no generic declarations, no hashtags, no emojis, no quotation marks, no explanations.
- Restraint over intensity. The most romantic line is often the quietest one.`;

interface QuoteRequest {
  title?: string;
  mood?: string;
  category?: string;
  caption?: string;
  note?: string;
  location?: string;
  date?: string;
}

/** Deterministic tiny hash so each photo keeps the same fallback forever. */
function stableHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* Fallback lines — written, not generated. Grouped by mood. */
const FALLBACKS: Record<string, string[]> = {
  tender: [
    "I kept this one. I didn't really have a choice.",
    "I don't think you know how beautiful you looked here. You rarely do.",
    "Somehow, this face became one of my favorite places.",
    "This is one of those photographs I look at for longer than I should.",
    "There are photographs that capture a moment, and then there are photographs that make me want to stay there."
  ],
  playful: [
    "You're doing the thing again. The face. You know the one.",
    "Objectively unfair, this photograph. I've filed a complaint. No one answered.",
    "I was going to scroll past this. I did not scroll past this.",
    "Whatever you were about to say here — I already know it was trouble."
  ],
  quiet: [
    "Nothing is happening in this photograph. That's exactly why I saved it.",
    "You were probably just standing there. My whole day reorganised itself anyway.",
    "Some pictures are loud. This one just stays.",
    "I like this one because it feels like the moment right before you noticed me looking."
  ],
  admiration: [
    "I think this is the photograph where I first understood how dangerous your smile could be.",
    "You look completely unaware of how beautiful this moment is. That makes it worse. Better. Worse.",
    "Some photographs are beautiful because of the person in them. This one is beautiful because it's you.",
    "I wish I could explain why this particular photograph stayed with me. I've stopped trying."
  ],
  golden: [
    "The light did its best here. You still won.",
    "I'd like to thank whatever the sun was doing that day.",
    "Everything in this picture is warm. I don't think it's the light."
  ],
  longing: [
    "I look at this one on the days you feel far away. It helps. Mostly.",
    "If I could stand inside one photograph for a while, it would probably be this one.",
    "I don't miss the place in this picture. You can guess what I miss."
  ]
};
const DEFAULT_POOL = [
  ...FALLBACKS.tender,
  ...FALLBACKS.quiet,
  ...FALLBACKS.admiration
];

export function fallbackQuote(photo: Photo): string {
  const pool = (photo.mood && FALLBACKS[photo.mood]) || DEFAULT_POOL;
  return pool[stableHash(photo.id || photo.image) % pool.length];
}

/** Calls your private endpoint if configured (VITE_QUOTE_API_URL).
    The endpoint owns the API key. The browser never sees it. */
export async function aiQuote(photo: Photo, signal?: AbortSignal): Promise<string | null> {
  const endpoint = import.meta.env.VITE_QUOTE_API_URL as string | undefined;
  if (!endpoint) return null;
  try {
    const body: QuoteRequest = {
      title: photo.title,
      mood: photo.mood,
      category: photo.category,
      caption: photo.caption,
      note: photo.note,
      location: photo.location,
      date: photo.date
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: body }),
      signal
    });
    if (!res.ok) return null;
    const data = await res.json();
    const q = typeof data?.quote === "string" ? data.quote.trim() : null;
    return q && q.length > 0 && q.length < 400 ? q : null;
  } catch {
    return null;
  }
}

/** manual → AI → fallback. Never throws, never returns empty. */
export async function generateQuote(photo: Photo, signal?: AbortSignal): Promise<string> {
  if (photo.quote && photo.quote.trim()) return photo.quote.trim();
  const ai = await aiQuote(photo, signal);
  if (ai) return ai;
  return fallbackQuote(photo);
}
