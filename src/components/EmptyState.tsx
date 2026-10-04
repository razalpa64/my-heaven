import type { SiteConfig } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";

/* No fake photographs, ever. When the archive is empty,
   it waits — beautifully. */

export default function EmptyState({ site }: { site: SiteConfig }) {
  const ref = useRevealAll<HTMLDivElement>();
  return (
    <div className="empty" ref={ref}>
      <span className="rv empty-frame" aria-hidden="true">
        <svg viewBox="0 0 220 280" fill="none" aria-hidden="true">
          <rect x="6" y="6" width="208" height="268" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
          <path d="M70 160 l30 -34 22 24 16 -16 22 26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="86" cy="104" r="9" stroke="currentColor" strokeWidth="1" />
        </svg>
      </span>
      <h2 className="serif rv empty-title" style={{ ["--delay" as string]: "0.25s" }}>
        {site.emptyTitle}
      </h2>
      <p className="rv empty-body" style={{ ["--delay" as string]: "0.45s" }}>
        {site.emptyBody}
      </p>
      <p className="label rv empty-hint" style={{ ["--delay" as string]: "0.65s" }}>
        {site.emptyHint}
      </p>
    </div>
  );
}
