import type { SiteConfig } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import Flourish from "./Flourish";

/* Closing the book. Large quiet space, then a signature. */

export default function Closing({ site, flowers }: { site: SiteConfig; flowers?: boolean }) {
  const ref = useRevealAll<HTMLElement>();
  return (
    <footer className="closing" ref={ref}>
      {flowers && <Flourish kind="petals" className="flor-closing" />}
      <div className="closing-space" aria-hidden="true" />
      <h2 className="serif rv closing-title">{site.closingTitle}</h2>
      <p className="rv closing-sub" style={{ ["--delay" as string]: "0.25s" }}>
        {site.closingSub}
      </p>
      <span className="rv closing-rule" aria-hidden="true" style={{ ["--delay" as string]: "0.4s" }} />
      <p className="sign write closing-sign" style={{ ["--delay" as string]: "0.6s", ["--dur" as string]: "1.6s" }}>
        {site.signature}
      </p>
      <p className="label rv closing-dedication" style={{ ["--delay" as string]: "0.95s" }}>
        {site.dedication}
      </p>
      <p className="hand write closing-ps" style={{ ["--delay" as string]: "1.25s", ["--dur" as string]: "1.35s" }}>
        {site.postscript}
      </p>
    </footer>
  );
}
