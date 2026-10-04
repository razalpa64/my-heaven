import type { LittleThing as LT } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";

/* Tiny handwritten fragments scattered between chapters —
   torn corners of paper, never all visible at once. */

export default function LittleThing({ thing, flip }: { thing: LT; flip?: boolean }) {
  const ref = useRevealAll<HTMLDivElement>();
  return (
    <div className={`little-thing ${flip ? "lt-flip" : ""}`} ref={ref}>
      <span className="label rv lt-label">one of the little things</span>
      <p className="hand write lt-text" style={{ ["--dur" as string]: "1.4s", ["--delay" as string]: "0.25s" }}>
        {thing.text}
      </p>
    </div>
  );
}
