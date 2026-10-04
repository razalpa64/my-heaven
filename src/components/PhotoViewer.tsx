import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "../config/types";
import { useQuote } from "../hooks/useQuote";
import { getAssetUrl } from "../utils/assets";

/* ──────────────────────────────────────────────────────────────
   The viewing room. Not a modal — the rest of the world simply
   goes quiet. Turning between photographs should feel like
   turning a page. Keyboard, swipe, ESC, all supported.
   ────────────────────────────────────────────────────────────── */

export default function PhotoViewer({
  photos,
  index,
  onNavigate,
  onClose
}: {
  photos: Photo[];
  index: number;
  onNavigate: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const quote = useQuote(photo);
  const [turn, setTurn] = useState<"none" | "next" | "prev">("none");
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = index + dir;
      if (next < 0 || next >= photos.length) return;
      setTurn(dir === 1 ? "next" : "prev");
      window.setTimeout(() => {
        onNavigate(next);
        setTurn("none");
      }, 240);
    },
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title ? `Photograph: ${photo.title}` : "Photograph"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) onClose();
      }}
    >
      <button ref={closeRef} className="viewer-close label" onClick={onClose} aria-label="Close the photograph">
        close ✕
      </button>

      <figure className={`viewer-page turn-${turn}`}>
        <div className="viewer-photo">
          <img src={getAssetUrl(photo.image)} alt={photo.alt || photo.title || "A photograph of her"} decoding="async" />
        </div>
        <figcaption className="viewer-words">
          {photo.title && <h3 className="serif viewer-title">{photo.title}</h3>}
          <p className="serif viewer-quote">“{quote}”</p>
          {photo.caption && <p className="viewer-caption">{photo.caption}</p>}
          {photo.note && <p className="hand viewer-note">{photo.note}</p>}
          {(photo.date || photo.location) && (
            <p className="label viewer-meta">{[photo.date, photo.location].filter(Boolean).join(" · ")}</p>
          )}
        </figcaption>
      </figure>

      <nav className="viewer-nav" aria-label="Photograph navigation">
        <button className="label viewer-btn" onClick={() => go(-1)} disabled={index === 0}>
          ← previous
        </button>
        <span className="label viewer-count" aria-hidden="true">
          {index + 1} / {photos.length}
        </span>
        <button className="label viewer-btn" onClick={() => go(1)} disabled={index === photos.length - 1}>
          next →
        </button>
      </nav>
    </div>
  );
}
