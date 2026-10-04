import type { SiteConfig } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import Flourish from "./Flourish";

/* The first page. Almost empty, like the inside cover of a book
   someone has clearly held for a long time. */

export default function Opening({ site, flowers }: { site: SiteConfig; flowers?: boolean }) {
  const ref = useRevealAll<HTMLElement>();
  return (
    <header className="opening" ref={ref}>
      {flowers && <Flourish kind="corner" className="flor-opening" />}
      {flowers && <Flourish kind="petals" className="flor-opening-foot" />}
      <div className="opening-inner">
        <p className="label rv opening-eyebrow" style={{ ["--delay" as string]: "0.2s" }}>
          {site.eyebrow}
        </p>
        <h1 className="serif opening-title">
          {site.title.map((line, i) => (
            <span key={i} className="rv opening-line" style={{ ["--delay" as string]: `${0.45 + i * 0.3}s` }}>
              {line}
            </span>
          ))}
        </h1>
        <p className="hand opening-sub write" style={{ ["--delay" as string]: "1.1s", ["--dur" as string]: "1.5s" }}>
          “{site.subtitle}”
        </p>
        {site.tagline && (
          <p className="label rv-still opening-tagline" style={{ ["--delay" as string]: "1.7s" }}>
            — {site.tagline} —
          </p>
        )}
      </div>

      {/* the cue anchors to the page itself, far below the words */}
      <div className="rv-still opening-cue" style={{ ["--delay" as string]: "2.2s" }} aria-hidden="true">
        <span className="label">{site.invitation}</span>
        <svg width="14" height="46" viewBox="0 0 14 46" fill="none">
          <path d="M7 1 C 6 14, 8 26, 7 40 M3.5 35 L7 43 L10.5 35" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <p className="rv-still opening-privacy" style={{ ["--delay" as string]: "1.9s" }}>
        {site.privacyLine}
      </p>
      <span className="pageno label" aria-hidden="true">i</span>
    </header>
  );
}
