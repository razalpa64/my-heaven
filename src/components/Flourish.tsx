/* Pressed flowers slipped between the pages. Purely decorative,
   multiply-blended into the paper, never intercepting a touch. */

export type FlourishKind = "corner" | "stem" | "petals";

const SRC: Record<FlourishKind, string> = {
  corner: "/flourish/fl-corner.jpg",
  stem: "/flourish/fl-stem.jpg",
  petals: "/flourish/fl-petals.jpg"
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
