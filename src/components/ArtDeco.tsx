import type { CSSProperties } from "react";

/* ──────────────────────────────────────────────────────────────
   Decorative SVG art elements — botanical sprigs, corner
   ornaments, and ink decorations. Ported from the-end-of-october
   reference design. SVG filters (rough/wash) are defined once
   by <SvgDefs /> rendered in App.tsx.
   ────────────────────────────────────────────────────────────── */

type P = { className?: string; style?: CSSProperties };

const INK = "#4B3430";
const L = { fill: "none", stroke: INK, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Shared SVG filters: wobbly ink lines + watercolour bleed. Render once in <App/>. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={1} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" />
        </filter>
        <filter id="wash" x="-6%" y="-6%" width="112%" height="112%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>
    </svg>
  );
}

/** Ink-drawn corner ornament — goes in page corners for that scrapbook feel */
export function Corner({ className, style }: P) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
      fill="none"
      stroke={INK}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.75"
    >
      <path d="M3 61 V16 C3 8 8 3 16 3 H61" />
      <path d="M11 53 V22 C11 16 16 11 22 11 H53" strokeOpacity="0.6" />
      <path d="M20 20 c6 -2 10 2 8 8 c-6 2 -10 -2 -8 -8Z" fill="#B97878" fillOpacity="0.35" />
      <path d="M32 20 q8 -3 14 0 M20 32 q-3 8 0 14" strokeOpacity="0.6" />
    </svg>
  );
}

/** Botanical sprig — a stem with leaves, placed in page corners */
export function Sprig({ className, style, leaf = "#8C927F", n = 5 }: P & { leaf?: string; n?: number }) {
  const ys = Array.from({ length: n }, (_, i) => 88 - i * (70 / n));

  const leaves = (fill?: string) =>
    ys.map((y, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const mx = 50 + side * 2;
      const cx1 = 50 + side * 24;
      const cx2 = 50 + side * 28;
      const ex = 50 + side * 22;
      return (
        <g key={i}>
          <path
            d={`M50 ${y} C${cx1} ${y - 10} ${cx2} ${y - 18} ${ex} ${y - 22} C${mx} ${y - 17} ${50 + side * 4} ${y - 9} 50 ${y}Z`}
            fill={fill ?? "none"}
          />
          <path
            d={`M51 ${y - 6} C63 ${y - 9} 72 ${y - 18} 76 ${y - 23} C63 ${y - 25} 54 ${y - 17} 51 ${y - 6}Z`}
            fill={fill ?? "none"}
            style={{ display: i % 2 === 0 ? "none" : undefined }}
          />
        </g>
      );
    });

  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <g filter="url(#wash)" opacity="0.85">
        {leaves(leaf)}
      </g>
      <g filter="url(#rough)" {...L} strokeWidth={1.3}>
        <path d="M50 99 C48 70 54 40 50 6" />
        {leaves()}
      </g>
    </svg>
  );
}

/** Tiny five-petal flower with stem */
export function TinyFlower({ className, style }: P) {
  const petalRing = (n: number, cx: number, cy: number, dist: number, rx: number, ry: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i * 360) / n;
      const rad = (a * Math.PI) / 180;
      const px = cx + dist * Math.sin(rad);
      const py = cy - dist * Math.cos(rad);
      return (
        <ellipse
          key={i}
          cx={px}
          cy={py}
          rx={rx}
          ry={ry}
          transform={`rotate(${a}, ${px}, ${py})`}
        />
      );
    });

  return (
    <svg viewBox="0 0 80 112" className={className} style={style} aria-hidden="true">
      <g filter="url(#wash)" opacity="0.8">
        <g fill="#D8A7A0">{petalRing(5, 40, 34, 13, 9.5, 13.5)}</g>
        <path d="M39 84 C28 78 22 80 17 70 C28 69 35 74 39 84Z" fill="#8C927F" />
        <path d="M40 94 C50 88 58 90 64 80 C52 79 44 84 40 94Z" fill="#8C927F" />
      </g>
      <g filter="url(#rough)" {...L}>
        {petalRing(5, 40, 34, 13, 9.5, 13.5)}
        <circle cx="40" cy="34" r="5" fill="#C8A66A" fillOpacity="0.8" />
        <path className="draw" pathLength={1} d="M40 50 C38 70 43 92 38 110" />
        <path d="M39 84 C28 78 22 80 17 70 C28 69 35 74 39 84Z" />
        <path d="M40 94 C50 88 58 90 64 80 C52 79 44 84 40 94Z" />
      </g>
    </svg>
  );
}

/** Ink squiggle decorative line */
export function Squiggle({ className, style, color = "#B97878" }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <path
        className="draw"
        pathLength={1}
        d="M2 8 C30 2 60 11 100 5 S170 9 198 3"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
