import type { SiteConfig } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import Flourish from "./Flourish";
import { TinyFlower } from "./ArtDeco";

/* ──────────────────────────────────────────────────────────────
   The first page. Cinematic, romantic, melodramatic.
   A full-screen love letter opening — handwritten title,
   floating flower, a breathing heartbeat line, an invitation.
   ────────────────────────────────────────────────────────────── */

export default function Opening({ site, flowers }: { site: SiteConfig; flowers?: boolean }) {
  const ref = useRevealAll<HTMLElement>();
  return (
    <header className="opening" ref={ref}>
      {flowers && <Flourish kind="corner" className="flor-opening" />}
      {flowers && <Flourish kind="petals" className="flor-opening-foot" />}

      <div className="opening-inner">
        {/* eyebrow — small label, fades in first */}
        <p className="label rv opening-eyebrow" style={{ ["--delay" as string]: "0.15s" }}>
          {site.eyebrow}
        </p>

        {/* main title — each line writes itself in */}
        <h1 className="serif opening-title">
          {site.title.map((line, i) => (
            <span
              key={i}
              className="write opening-line"
              style={{
                ["--delay" as string]: `${0.4 + i * 0.55}s`,
                ["--dur" as string]: `${1.6 + i * 0.3}s`,
              }}
            >
              {line}
            </span>
          ))}
        </h1>

        {/* heartbeat ornament line between title and subtitle */}
        <div className="opening-heartline rv" style={{ ["--delay" as string]: "1.5s" }} aria-hidden="true">
          <svg viewBox="0 0 220 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="draw"
              pathLength={1}
              style={{ ["--dur" as string]: "1.8s", ["--delay" as string]: "1.5s" }}
              d="M0 16 H72 L80 4 L88 28 L96 12 L104 20 L112 16 H220"
              stroke="#B97878"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="110" cy="16" r="3" fill="#B97878" fillOpacity="0" className="heartdot" />
          </svg>
        </div>

        {/* subtitle — handwritten, ink-wipe reveal */}
        <p
          className="hand opening-sub write"
          style={{ ["--delay" as string]: "2.0s", ["--dur" as string]: "2.2s" }}
        >
          "{site.subtitle}"
        </p>

        {/* tagline */}
        {site.tagline && (
          <p className="label rv-still opening-tagline" style={{ ["--delay" as string]: "3.2s" }}>
            — {site.tagline} —
          </p>
        )}

        {/* tiny floating flower accent */}
        <div
          className="opening-flower rv"
          style={{ ["--delay" as string]: "2.8s" }}
          aria-hidden="true"
        >
          <TinyFlower className="sway" style={{ width: "2.4rem" }} />
        </div>
      </div>

      {/* scroll cue */}
      <div className="rv-still opening-cue" style={{ ["--delay" as string]: "3.6s" }} aria-hidden="true">
        <span className="label">{site.invitation}</span>
        <svg width="14" height="46" viewBox="0 0 14 46" fill="none">
          <path
            d="M7 1 C 6 14, 8 26, 7 40 M3.5 35 L7 43 L10.5 35"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="rv-still opening-privacy" style={{ ["--delay" as string]: "2.2s" }}>
        {site.privacyLine}
      </p>
      <span className="pageno label" aria-hidden="true">i</span>
    </header>
  );
}
