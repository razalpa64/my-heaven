import type { Chapter } from "../config/types";
import { useRevealAll } from "../hooks/useReveal";
import Flourish, { FlourishKind } from "./Flourish";

/* A chapter page from a novel, not a website section header. */

const KINDS: FlourishKind[] = ["petals", "stem", "corner"];

export default function ChapterIntro({ chapter, index = 0, flowers }: { chapter: Chapter; index?: number; flowers?: boolean }) {
  const ref = useRevealAll<HTMLDivElement>();
  return (
    <div className="chapter-intro" ref={ref}>
      {flowers && (
        <Flourish
          kind={KINDS[index % KINDS.length]}
          className={`flor-chapter flor-chapter-${index % 2 === 0 ? "l" : "r"}`}
        />
      )}
      <p className="label rv chapter-numeral">Chapter {chapter.numeral}</p>
      <span className="rv chapter-rule" aria-hidden="true" style={{ ["--delay" as string]: "0.2s" }} />
      <h2 className="serif rv chapter-title" style={{ ["--delay" as string]: "0.3s" }}>
        {chapter.title}
      </h2>
      {chapter.subtitle && (
        <p className="rv chapter-sub" style={{ ["--delay" as string]: "0.45s" }}>
          {chapter.subtitle}
        </p>
      )}
      {chapter.epigraph && (
        <p className="serif rv chapter-epigraph" style={{ ["--delay" as string]: "0.6s" }}>
          {chapter.epigraph}
        </p>
      )}
    </div>
  );
}
