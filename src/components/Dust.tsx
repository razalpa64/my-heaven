import { useMemo, type CSSProperties } from "react";

/* ──────────────────────────────────────────────────────────────
   Dust motes — 18 tiny golden particles drifting upward,
   exactly as in the-end-of-october reference.
   ────────────────────────────────────────────────────────────── */

export default function Dust() {
  const motes = useMemo(() => {
    let s = 9;
    const r = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: 18 }, () => ({
      l: `${(r() * 100).toFixed(1)}%`,
      s: `${(2 + r() * 3).toFixed(1)}px`,
      d: `${(22 + r() * 22).toFixed(0)}s`,
      dl: `${(-r() * 40).toFixed(0)}s`,
      x: `${((r() - 0.5) * 120).toFixed(0)}px`,
    }));
  }, []);

  return (
    <div className="dust" aria-hidden="true">
      {motes.map((m, i) => (
        <span
          key={i}
          style={
            {
              "--l": m.l,
              "--s": m.s,
              "--d": m.d,
              "--dl": m.dl,
              "--x": m.x,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
