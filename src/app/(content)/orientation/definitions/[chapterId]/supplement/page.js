import { notFound } from "next/navigation";
import Link from "next/link";
import chapters from "@/data/def";
import "../../definitions.css";

export default async function SupplementPage({ params }) {
  const { chapterId } = await params;
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter || !chapter.supplement) {
    notFound();
  }

  const { supplement } = chapter;
  return (
    <div>
      <div className="ch-header">
        <div className="idx-header">
        <div className="idx-eyebrow">
          DOGSTAR DEFINITIONS · 201 Supplement
        </div>
          <div className="idx-title">{supplement.title} <span>{supplement.num}</span></div>
          <div className="ch-num"></div>
          <p className="idx-sub">{supplement.subTitle}</p>
        </div>
        <div className="idx-line" />
        <div className="cover-intro">
            <p>{supplement.content}</p>
            <p>{supplement.contentTwo}</p>
            <p>{supplement.contentThree}</p>
        </div>
        <div className="cover-count"><span>{supplement.terms.length}</span> terms · {supplement.subTitle}</div>
        <Link href={`/orientation/definitions/${chapter.id}/supplement/terms`} className="cover-enter-btn">
          Enter
        </Link>
        <div className="cover-hint">Tap any term to read its definition</div>
        <div className="ch-nav-top">
          <Link href={`/orientation/definitions/${chapter.id}`} className="nav-btn-def">
            ← Back to {chapter.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
