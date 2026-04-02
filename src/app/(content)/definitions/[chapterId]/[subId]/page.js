// app/definitions/[chapterId]/[subId]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import chapters from '@/data/def';
import SubSideNav from '@/app/components/SubSideNav';
import '../../definitions.css';

export default async function Subpage({ params }) {
  const { chapterId, subId } = await params;

  

  // Find chapter by the clean numeric id
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    console.error("Chapter not found for id:", chapterId);
    notFound();
  }

  // Find the term
  const sub = chapter.terms.find((t) => t[0] === subId);
  if (!sub) {
    console.error("Term not found:", subId);
    notFound();
  }

  const [number, title, pronunciation, partOfSpeech, definition, type, insight, time] = sub;
  return (
    <div>

<div id="view-entry" className="view active">
      <div className="entry-layout">
        <div>
            <div className="entry-nav-top">
                <div className="breadcrumb">
                    {/* ADD NAV LATER */}
                    <Link
                        href={`/definitions/`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}    
                    >
                    <span className="bc-item">◎ Home</span>
                    </Link>
                    <span className="bc-sep">›</span>
                    <Link
                        href={`/definitions/${chapter.id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}    
                    >
                    <span id="bcChapter" className="bc-item">{chapter.num} {chapter.title}</span>
                    </Link>
                    <span className="bc-sep">›</span>
                    <span id="bcTerm" className="bc-current">{title}</span>
                </div>
            <div id="entryStamp" className="entry-stamp">◷ {time}</div>
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
            <div id="progressRow" className="entry-progress fade-up">
                {/* <div id="progBox" className="prog-box"></div> */}
                {/* <span id="progLabel" className="prog-label">Mark as in progress</span> */}
            </div>
            <div className="entry-nav-bottom">
                {number > 1 ? (
                <Link
                    href={`/definitions/${chapter.id}/${parseInt(number) - 1}`}
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
                    href={`/definitions/${chapter.id}`}
                    id="btnIndex" className="nav-btn"
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}    
                >
                  Chapter Index
                </Link>
                {number < 20 ? (
                    <Link
                    href={`/definitions/${chapter.id}/${parseInt(number) + 1}`}
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

        </div>
      
      
      <SubSideNav
        chapterId={chapter.id}
        currentSubId={subId}
        terms={chapter.terms}
        title={chapter.title}
        number={chapter.num}
      />
      </div>
    </div>
    </div>
  );
} 