import { useMemo } from "react";

/* ──────────────────────────────────────────────────────────────
   Falling rose petals and warm starlight motes drifting down.
   Multiply-blended into the fine paper, never intercepting touches,
   poetically paced like an intimate film.
   ────────────────────────────────────────────────────────────── */

const PETAL_COUNT = 12;
const MOTE_COUNT = 6;

export default function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        left: (i * 8.3 + 3) % 94,
        fallDelay: -((i * 5.7) % 36),
        fallDur: 26 + ((i * 4.9) % 18),
        swayDur: 4.8 + (i % 4) * 1.4,
        scale: 0.6 + ((i * 31) % 45) / 100,
        hue: i % 4,
        rotate: (i * 47) % 360
      })),
    []
  );

  const motes = useMemo(
    () =>
      Array.from({ length: MOTE_COUNT }, (_, i) => ({
        left: (i * 17.3 + 9) % 92,
        delay: -((i * 6.2) % 24),
        dur: 18 + ((i * 3.7) % 12),
        size: 2.5 + (i % 3) * 1.5
      })),
    []
  );

  return (
    <div className="petals" aria-hidden="true">
      {/* Rose Petals */}
      {petals.map((p, i) => (
        <span
          key={`petal-${i}`}
          className={`petal petal-h${p.hue}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.fallDelay}s, ${p.fallDelay * 0.55}s`,
            animationDuration: `${p.fallDur}s, ${p.swayDur}s`,
            ["--pscale" as string]: p.scale,
            ["--prot" as string]: `${p.rotate}deg`
          }}
        >
          {/* Petal inner vein / fold curve */}
          <span className="petal-curve" />
        </span>
      ))}

      {/* Floating golden starlight / candlelight motes */}
      {motes.map((m, i) => (
        <span
          key={`mote-${i}`}
          className="starlight-mote"
          style={{
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`
          }}
        />
      ))}

      {/* Cinematic 35mm Analog Film Light Leak */}
      <div className="film-light-leak" />
      <div className="film-light-leak film-light-leak-2" />
      <div className="cinematic-vignette" />
    </div>
  );
}
