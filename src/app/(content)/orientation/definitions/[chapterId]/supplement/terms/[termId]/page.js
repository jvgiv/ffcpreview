import { notFound } from "next/navigation";
import Link from "next/link";
import chapters from "@/data/def";
import SubSideNav from "@/app/components/SubSideNav";
import "../../../../definitions.css";

export default async function SupplementTermDetailPage({ params }) {
  const { chapterId, termId } = await params;
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter || !chapter.supplement) {
    notFound();
  }

  const { supplement } = chapter;
  const term = supplement.terms.find((t) => String(t[0]) === String(termId));
  if (!term) {
    notFound();
  }

  const [number, title, pronunciation, partOfSpeech, definition, type, insight] = term;

  return (
      <div>
      <div id="view-entry" className="view active">
        <div className="entry-layout">
          <div>
            <div className="entry-nav-top">
              <div className="breadcrumb">
                <Link href="/orientation/definitions" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="bc-item">◎ Home</span>
                </Link>
                <span className="bc-sep">›</span>
                <Link href={`/orientation/definitions/${chapter.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="bc-item">{chapter.num} {chapter.title}</span>
                </Link>
                <span className="bc-sep">›</span>
                <Link href={`/orientation/definitions/${chapter.id}/supplement`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <span className="bc-item">Supplement</span>
                </Link>
                <span className="bc-sep">›</span>
                <span className="bc-current">{title}</span>
              </div>
            </div>

            <div className="entry-header fade-up">
              <div id="entryNum" className="entry-num">{number}</div>
              <div id="entryWord" className="entry-word">{title}</div>
              <div className="entry-meta">
                <span id="entryPron" className="entry-pron">{pronunciation}</span>
                <span id="entryPos" className="entry-pos">{partOfSpeech}</span>
              </div>
            </div>
            <div className="entry-divider"></div>
            <div id="entryDef" className="entry-def fade-up">{definition}</div>
            <div id="entryNoteWrap" className="entry-note fade-up">
              <div id="entryNoteLabel" className="entry-note-label">Field Note:</div>
              <div id="entryNote" className="entry-note-text">{insight}</div>
            </div>
            <a
              href="mailto:deliberate@FarFlungChange.com"
              id="btnEmail"
              className="nav-btn"
              rel="noreferrer"
              target="_blank"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Submit your Orientation Question
            </a>
            <div id="progressRow" className="entry-progress fade-up"></div>
            <div className="entry-nav-bottom">
                {number > 1 ? (
                <Link
                    href={`/orientation/definitions/${chapter.id}/supplement/terms/${parseInt(number) - 1}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}    
                    id="btnPrev" 
                    className="nav-btn"
                >
                    ← Previous
                </Link>
                ) : <button id="btnPrev" className="nav-btn" style={{cursor: 'none'}}>← Previous</button> }
                <Link
                    href={`/orientation/definitions/${chapter.id}`}
                    id="btnIndex" className="nav-btn"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}    
                >
                  Chapter Index
                </Link>
                
                {number < chapter.supplement.terms.length ? (
                    <Link
                    href={`/orientation/definitions/${chapter.id}/supplement/terms/${parseInt(number) + 1}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit'
                    }}    
                    id="btnNext" 
                    className="nav-btn primary"
                    >
                    Next →
                </Link>
                ) : <button id="btnNext" className="nav-btn primary" style={{cursor: 'none'}}>Next →</button> }
                </div>

            <div className="entry-nav-bottom">
              <Link href={`/orientation/definitions/${chapter.id}/supplement/terms`} id="btnIndex" className="nav-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
                ← Supplement terms
              </Link>
              {/* <Link href={`/definitions/${chapter.id}`} id="btnChapter" className="nav-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
                ← Back to chapter
              </Link> */}
            </div>
          </div>
          <SubSideNav
            chapterId={chapter.id}
            currentSubId={number}
            terms={chapter.supplement.terms}
            title={chapter.supplement.title}
            number={supplement.num}
            basePath={`/orientation/definitions/${chapter.id}/supplement/terms`}
          />
        </div>
      </div>
    </div>
  );
}
