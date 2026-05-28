import { notFound } from "next/navigation";
import Link from "next/link";
import chapters from "@/data/def";
import "../../../definitions.css";

export default async function SupplementTermsPage({ params }) {
  const { chapterId } = await params;
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter || !chapter.supplement) {
    notFound();
  }

  const { supplement } = chapter;
  return (
    <div>
      <div className="ch-header">
        <div className="ch-eyebrow">{chapter.num} · Supplement</div>
        <div className="ch-title-wrap">
          <div className="ch-num">{supplement.num}</div>
          <div className="ch-name">{supplement.title}</div>
        </div>
        <p className="ch-focus">{supplement.subTitle}</p>
        <p className="ch-hint">Select a supplemental term to review its description</p>
        <div className="supp-back-buttons">
          <Link href={`/orientation/definitions/${chapter.id}/supplement`} className="nav-btn-supp">
            ← Back to supplement intro
          </Link>
          <Link href={`/orientation/definitions/${chapter.id}`} className="nav-btn-supp">
            ← Back to chapter
          </Link>
          <p>Search for a term here:</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supplement.terms.map((term) => {
          const [number, title, pronunciation, partOfSpeech] = term;
          return (
            <Link
              key={number}
              href={`/orientation/definitions/${chapter.id}/supplement/terms/${number}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div id="termIndex" className="term-index">
                <div className="term-index-item">
                  <span className="ti-num">{number}</span>
                  <span className="ti-name v6-link">{title}</span>
                  <span className="ti-pos">{partOfSpeech}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
