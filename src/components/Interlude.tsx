import type { Interlude as IV } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import Flourish from "./Flourish";

/* A "one more thing" moment. Rare. Mostly empty space,
   which is the point. */

export default function Interlude({ moment, flowers }: { moment: IV; flowers?: boolean }) {
  const ref = useRevealAll<HTMLDivElement>();
  return (
    <div className="interlude" ref={ref}>
      {flowers && <Flourish kind="stem" className="flor-interlude" />}
      {moment.whisper && (
        <p className="hand rv interlude-whisper">{moment.whisper}</p>
      )}
      <p className="serif interlude-lines">
        {moment.lines.map((l, i) => (
          <span key={i} className="rv" style={{ ["--delay" as string]: `${0.3 + i * 0.3}s` }}>
            {l}
          </span>
        ))}
      </p>
      {moment.closing && (
        <p className="rv interlude-closing" style={{ ["--delay" as string]: `${0.45 + moment.lines.length * 0.3}s` }}>
          {moment.closing}
        </p>
      )}
    </div>
  );
}
