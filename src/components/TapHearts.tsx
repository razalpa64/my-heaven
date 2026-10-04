import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   Subtle interactive romantic sparkles & hearts on tap/click.
   Adds warmth and playful tactile romance to her gallery.
   Never intercepts touches, automatically cleans up.
   ────────────────────────────────────────────────────────────── */

interface Sparkle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
}

const SYMBOLS = ["♥", "❦", "✦", "♡", "✧"];
const COLORS = ["#c96b78", "#d4af37", "#e8a598", "#b97878", "#a1414c"];

export default function TapHearts() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let count = 0;
    const handleTap = (e: MouseEvent | TouchEvent) => {
      // Don't trigger if clicking sliders, buttons or inputs
      const target = e.target as HTMLElement | null;
      if (target && (target.closest("button") || target.closest("input") || target.closest("a"))) {
        return;
      }

      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const newSparkle: Sparkle = {
        id: ++count,
        x: clientX,
        y: clientY,
        symbol: SYMBOLS[count % SYMBOLS.length],
        color: COLORS[count % COLORS.length]
      };

      setSparkles((prev) => [...prev.slice(-12), newSparkle]);

      window.setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 900);
    };

    window.addEventListener("click", handleTap);
    return () => window.removeEventListener("click", handleTap);
  }, []);

  return (
    <div className="tap-hearts-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="tap-heart"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            color: s.color
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}
