import { useMemo } from "react";

/* A handful of petals drifting down, slowly, like the end credits
   of a film nobody wants to leave. Few in number, multiply-blended,
   never intercepting a touch. Hidden entirely under reduced motion. */

const COUNT = 8;

export default function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        left: (i * 13.7 + 4) % 94,
        fallDelay: -((i * 9.3) % 34),
        fallDur: 30 + ((i * 6.1) % 16),
        swayDur: 5.5 + (i % 4) * 1.3,
        scale: 0.55 + ((i * 37) % 45) / 100,
        hue: i % 3
      })),
    []
  );
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal petal-h${p.hue}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.fallDelay}s, ${p.fallDelay * 0.6}s`,
            animationDuration: `${p.fallDur}s, ${p.swayDur}s`,
            ["--pscale" as string]: p.scale
          }}
        />
      ))}
    </div>
  );
}
