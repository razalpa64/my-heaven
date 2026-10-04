import { useEffect, useState } from "react";
import type { Photo } from "../config/types";
import { generateQuote, fallbackQuote } from "../utils/quotes";

/** Resolves a photo's quote (manual → AI → fallback) without ever
    leaving the UI empty while it thinks. */
export function useQuote(photo: Photo): string {
  const [quote, setQuote] = useState<string>(
    photo.quote?.trim() || fallbackQuote(photo)
  );
  useEffect(() => {
    if (photo.quote?.trim()) {
      setQuote(photo.quote.trim());
      return;
    }
    const ctrl = new AbortController();
    generateQuote(photo, ctrl.signal).then((q) => {
      if (!ctrl.signal.aborted) setQuote(q);
    });
    return () => ctrl.abort();
  }, [photo.id, photo.quote]);
  return quote;
}
