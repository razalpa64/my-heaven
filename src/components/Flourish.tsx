/* Pressed flowers slipped between the pages. Purely decorative,
   multiply-blended into the paper, never intercepting a touch. */

export type FlourishKind = "corner" | "stem" | "petals";

const SRC: Record<FlourishKind, string> = {
  corner: "/flourish/fl-corner.png",
  stem: "/flourish/fl-stem.png",
  petals: "/flourish/fl-petals.png"
};

export default function Flourish({
  kind,
  className = ""
}: {
  kind: FlourishKind;
  className?: string;
}) {
  return (
    <img
      src={SRC[kind]}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`flor ${className}`}
    />
  );
}
