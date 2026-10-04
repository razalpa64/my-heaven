import { useState } from "react";
import type { Photo, PhotoLayout } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import { useQuote } from "../hooks/useQuote";

/* ──────────────────────────────────────────────────────────────
   Every photograph gets its own small composition — a page,
   not a card. The layout can be set in JSON; when omitted,
   a rhythm is chosen from the photo's position and its real
   orientation (measured when the image loads).
   ────────────────────────────────────────────────────────────── */

const PORTRAIT_RHYTHM: PhotoLayout[] = ["portrait-editorial", "floating", "offset", "polaroid", "portrait-editorial", "filmstrip"];
const LANDSCAPE_RHYTHM: PhotoLayout[] = ["cinema", "offset", "floating", "cinema", "filmstrip", "polaroid"];

type Orientation = "portrait" | "landscape" | "square" | "unknown";

export default function PhotoChapter({
  photo,
  index,
  page,
  onOpen
}: {
  photo: Photo;
  index: number;
  page?: number;
  onOpen: () => void;
}) {
  const ref = useRevealAll<HTMLElement>();
  const quote = useQuote(photo);
  const [orientation, setOrientation] = useState<Orientation>("unknown");
  const [broken, setBroken] = useState(false);

  const layout: PhotoLayout =
    photo.layout && photo.layout !== "auto"
      ? photo.layout
      : orientation === "landscape"
        ? LANDSCAPE_RHYTHM[index % LANDSCAPE_RHYTHM.length]
        : PORTRAIT_RHYTHM[index % PORTRAIT_RHYTHM.length];

  const side = index % 2 === 0 ? "l" : "r";
  const accentStyle = photo.accent ? ({ ["--photo-accent" as string]: photo.accent } as React.CSSProperties) : undefined;

  const img = broken ? (
    <div className="photo-missing" role="img" aria-label={photo.alt || photo.title || "A missing photograph"}>
      <span className="hand">this one is shy —<br />the file didn’t arrive</span>
      <span className="label">{photo.image}</span>
    </div>
  ) : (
    <img
      src={photo.image}
      alt={photo.alt || photo.title || "A photograph of her"}
      loading="lazy"
      decoding="async"
      onLoad={(e) => {
        const el = e.currentTarget;
        const r = el.naturalWidth / Math.max(el.naturalHeight, 1);
        setOrientation(r > 1.15 ? "landscape" : r < 0.87 ? "portrait" : "square");
      }}
      onError={() => setBroken(true)}
    />
  );

  return (
    <figure
      ref={ref}
      className={`photo-page lay-${layout} side-${side} ori-${orientation} ${photo.featured ? "is-featured" : ""}`}
      style={accentStyle}
    >
      {photo.category && <span className="label photo-cat rv">{photo.category}</span>}

      <button
        className="photo-frame rv"
        onClick={onOpen}
        aria-label={`Open photograph${photo.title ? `: ${photo.title}` : ""}`}
        style={{ ["--delay" as string]: "0.1s" }}
      >
        {img}
        {layout === "filmstrip" && (
          <span className="film-edge" aria-hidden="true">
            <span className="label film-no">{String(index + 1).padStart(2, "0")}A</span>
          </span>
        )}
      </button>

      {photo.note && (
        <span className="hand photo-note write" style={{ ["--delay" as string]: "0.9s", ["--dur" as string]: "1.3s" }}>
          {photo.note}
        </span>
      )}

      <figcaption className="photo-words">
        {photo.title && (
          <h3 className="serif photo-title rv" style={{ ["--delay" as string]: "0.3s" }}>
            {photo.title}
          </h3>
        )}
        <blockquote className="photo-quote rv" style={{ ["--delay" as string]: "0.45s" }}>
          <p className="serif">{quote}</p>
        </blockquote>
        {photo.caption && (
          <p className="photo-caption rv" style={{ ["--delay" as string]: "0.6s" }}>
            {photo.caption}
          </p>
        )}
        {(photo.date || photo.location) && (
          <p className="label photo-meta rv" style={{ ["--delay" as string]: "0.7s" }}>
            {[photo.date, photo.location].filter(Boolean).join(" · ")}
          </p>
        )}
      </figcaption>

      {page !== undefined && (
        <span className="pageno label" aria-hidden="true">
          {page}
        </span>
      )}
    </figure>
  );
}
