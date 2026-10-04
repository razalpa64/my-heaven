import { useState } from "react";
import type { Photo, PhotoLayout } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import { useQuote } from "../hooks/useQuote";
import { getAssetUrl } from "../utils/assets";

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
  const [loaded, setLoaded] = useState(false);

  const handleImageLoaded = (el: HTMLImageElement) => {
    if (el.naturalWidth > 0) {
      const r = el.naturalWidth / Math.max(el.naturalHeight, 1);
      setOrientation(r > 1.15 ? "landscape" : r < 0.87 ? "portrait" : "square");
    }
    setLoaded(true);
  };

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
      <span className="hand">this one is shy<br />the file did not arrive</span>
      <span className="label">{photo.image}</span>
    </div>
  ) : (
    <div className={`photo-img-wrap ${loaded ? "is-loaded" : "is-loading"}`}>
      {!loaded && <div className="photo-shimmer" aria-hidden="true" />}
      <img
        src={getAssetUrl(photo.image)}
        alt={photo.alt || photo.title || "A photograph of her"}
        decoding="async"
        loading={index < 4 ? "eager" : "lazy"}
        fetchPriority={index < 3 ? "high" : "auto"}
        className={`photo-img ${loaded ? "photo-img-ready" : "photo-img-init"}`}
        ref={(el) => {
          if (el && el.complete && !loaded) {
            handleImageLoaded(el);
          }
        }}
        onLoad={(e) => handleImageLoaded(e.currentTarget)}
        onError={() => setBroken(true)}
      />
    </div>
  );

  return (
    <figure
      ref={ref}
      className={`photo-page lay-${layout} side-${side} ori-${orientation} ${photo.featured ? "is-featured" : ""}`}
      style={accentStyle}
    >
      <div className="photo-header-row">
        <div className="photo-header-left">
          {photo.category && <span className="label photo-cat rv">{photo.category}</span>}
          <span className="label photo-film-still rv" style={{ ["--delay" as string]: "0.15s" }}>
            Take {String(index + 1).padStart(2, "0")} · 35mm
          </span>
        </div>
        {photo.featured && <span className="label photo-featured-badge rv">❦ cherished</span>}
      </div>

      <button
        className="photo-frame rv"
        onClick={onOpen}
        aria-label={`Open photograph${photo.title ? `: ${photo.title}` : ""}`}
        style={{ ["--delay" as string]: "0.1s" }}
      >
        {layout === "polaroid" && <span className="polaroid-tape" aria-hidden="true" />}
        <span className="frame-corner frame-corner-tl" aria-hidden="true" />
        <span className="frame-corner frame-corner-tr" aria-hidden="true" />
        <span className="frame-corner frame-corner-bl" aria-hidden="true" />
        <span className="frame-corner frame-corner-br" aria-hidden="true" />
        
        <div className="photo-mat">
          {img}
        </div>

        {layout === "filmstrip" && (
          <span className="film-edge" aria-hidden="true">
            <span className="label film-no">{String(index + 1).padStart(2, "0")}A</span>
          </span>
        )}
      </button>

      {photo.note && (
        <span className="hand photo-note write" style={{ ["--delay" as string]: "0.5s", ["--dur" as string]: "1.3s" }}>
          {photo.note}
        </span>
      )}

      <figcaption className="photo-words">
        {photo.title && (
          <h3 className="serif photo-title rv" style={{ ["--delay" as string]: "0.2s" }}>
            {photo.title}
          </h3>
        )}
        <blockquote className="photo-quote rv" style={{ ["--delay" as string]: "0.32s" }}>
          <p className="serif">{quote}</p>
        </blockquote>
        {photo.caption && (
          <p className="photo-caption rv" style={{ ["--delay" as string]: "0.45s" }}>
            {photo.caption}
          </p>
        )}
        {(photo.date || photo.location) && (
          <p className="label photo-meta rv" style={{ ["--delay" as string]: "0.55s" }}>
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
