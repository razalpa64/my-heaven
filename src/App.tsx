import { useEffect, useMemo, useState } from "react";
import raw from "./data/gallery.json";
import type { GalleryConfig, Photo } from "./config/types";
import Gate from "./components/Gate";
import Opening from "./components/Opening";
import ChapterIntro from "./components/ChapterIntro";
import PhotoChapter from "./components/PhotoChapter";
import PhotoViewer from "./components/PhotoViewer";
import LittleThing from "./components/LittleThings";
import Interlude from "./components/Interlude";
import EmptyState from "./components/EmptyState";
import Closing from "./components/Closing";
import MusicPlayer from "./components/MusicPlayer";
import Petals from "./components/Petals";
import TapHearts from "./components/TapHearts";
import Dust from "./components/Dust";
import { SvgDefs } from "./components/ArtDeco";
import { isUnlocked } from "./utils/auth";
import { getAssetUrl } from "./utils/assets";

const config = raw as unknown as GalleryConfig;

export default function App() {
  const [open, setOpen] = useState<boolean>(() => isUnlocked());
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  /* theme → CSS variables, entirely data-driven */
  useEffect(() => {
    const t = config.theme;
    const r = document.documentElement.style;
    r.setProperty("--bg", t.background);
    r.setProperty("--paper", t.paper);
    r.setProperty("--text", t.text);
    r.setProperty("--muted", t.mutedText);
    r.setProperty("--accent", t.accent);
    r.setProperty("--accent-soft", t.accentSoft);
    r.setProperty("--border", t.border);
    r.setProperty("--gold", t.gold);
    r.setProperty("--ink", t.ink);
    document.body.classList.toggle("no-grain", !config.gallery.grain);
    document.body.classList.toggle("no-anim", !config.gallery.animation);

    /* Eagerly preload photos in background for instant display */
    if (config.photos && config.photos.length > 0) {
      config.photos.forEach((p) => {
        if (p.image) {
          const img = new Image();
          img.src = getAssetUrl(p.image);
        }
      });
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", !open || viewerIndex !== null);
  }, [open, viewerIndex]);

  /* photos grouped by chapter, preserving json order */
  const byChapter = useMemo(() => {
    const map = new Map<string, Photo[]>();
    for (const c of config.chapters) map.set(c.id, []);
    const loose: Photo[] = [];
    for (const p of config.photos) {
      if (p.chapter && map.has(p.chapter)) map.get(p.chapter)!.push(p);
      else loose.push(p);
    }
    return { map, loose };
  }, []);

  const allPhotos = config.photos;
  const hasPhotos = allPhotos.length > 0;

  /* little things dealt out between chapters, one or two at a time */
  const littleThings = config.littleThings ?? [];
  let ltCursor = 0;
  const takeLittleThings = (n: number) => {
    const slice = littleThings.slice(ltCursor, ltCursor + n);
    ltCursor += n;
    return slice;
  };

  const openViewerAt = (photo: Photo) => {
    const i = allPhotos.findIndex((p) => p.id === photo.id);
    if (i >= 0) setViewerIndex(i);
  };

  const flowers = config.gallery.flourishes;

  /* page numbering: roman for the opening, arabic for chapters */
  let pageNo = 0;
  ltCursor = 0;

  const visibleChapters = config.chapters.filter(
    (c) => (byChapter.map.get(c.id) ?? []).length > 0
  );

  return (
    <>
      {/* SVG filter defs: ink wobble + watercolour wash — used by corner/sprig SVGs */}
      <SvgDefs />

      {/* Always-visible atmospheric background elements */}
      <Dust />

      {!open ? (
        <Gate site={config.site} onOpen={() => setOpen(true)} flowers={flowers} />
      ) : (
        <main className="book">
          {config.gallery.petals && <Petals />}
          <Opening site={config.site} flowers={flowers} />

          {!hasPhotos && <EmptyState site={config.site} />}

          {hasPhotos &&
            visibleChapters.map((chapter, ci) => {
              const photos = byChapter.map.get(chapter.id) ?? [];
              const interlude = config.interludes?.find((iv) => iv.after === chapter.id);
              const fragments = takeLittleThings(ci % 2 === 0 ? 1 : 2);
              return (
                <section key={chapter.id} className="chapter" aria-label={`Chapter ${chapter.numeral}: ${chapter.title}`}>
                  <ChapterIntro chapter={chapter} index={ci} flowers={flowers} />
                  {photos.map((photo, pi) => {
                    pageNo += 1;
                    return (
                      <PhotoChapter
                        key={photo.id}
                        photo={photo}
                        index={pi}
                        page={config.gallery.pageNumbers ? pageNo : undefined}
                        onOpen={() => openViewerAt(photo)}
                      />
                    );
                  })}
                  {fragments.map((lt, i) => (
                    <LittleThing key={`${chapter.id}-lt-${i}`} thing={lt} flip={i % 2 === 1} />
                  ))}
                  {interlude && <Interlude moment={interlude} flowers={flowers} />}
                </section>
              );
            })}

          {hasPhotos && byChapter.loose.length > 0 && (
            <section className="chapter" aria-label="Unfiled photographs">
              {byChapter.loose.map((photo, pi) => {
                pageNo += 1;
                return (
                  <PhotoChapter
                    key={photo.id}
                    photo={photo}
                    index={pi}
                    page={config.gallery.pageNumbers ? pageNo : undefined}
                    onOpen={() => openViewerAt(photo)}
                  />
                );
              })}
            </section>
          )}

          {/* any little things not yet dealt out appear before the closing */}
          {littleThings.slice(ltCursor).map((lt, i) => (
            <LittleThing key={`tail-lt-${i}`} thing={lt} flip={i % 2 === 1} />
          ))}

          <Closing site={config.site} flowers={flowers} />

          {viewerIndex !== null && (
            <PhotoViewer
              photos={allPhotos}
              index={viewerIndex}
              onNavigate={setViewerIndex}
              onClose={() => setViewerIndex(null)}
            />
          )}
        </main>
      )}

      {config.music?.enabled && <MusicPlayer music={config.music} />}
      <TapHearts />
    </>
  );
}
