import { notFound } from 'next/navigation';
import Link from 'next/link';
import chapters from '@/data/def';
import '../definitions.css';

export default async function ChapterPage({ params }) {
    const { chapterId } = await params;


  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter) {
    notFound();
  }


  return (
    <div 
        // id="view-chapter" 
        // className="view"
        >
            <div className="ch-header">
                <div id="chEyebrow" className="ch-eyebrow">Hole {chapter.id} of {chapters.length} · ◷ {chapter.terms[0][7]} - {chapter.terms[19][7]}</div>
                <div className="ch-title-wrap">
                    <div id="chNum" className='ch-num'>{chapter.num}</div>
                    <div id="chName" className="ch-name">{chapter.title}</div>
                </div>
                <p id="chFocus" className="ch-focus">{chapter.focus}</p>
                {/* CLOCK GOES HERE */}
                <p className="ch-hint">Select a term to read it's definition</p>
            </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapter.terms.map((sub, index) => (
            <div key={index} id="termIndex" className="term-index">
          <Link
            key={index}
            href={`/definitions/${chapter.id}/${sub[0]}`}   // chapter id + term code
            style={{
                textDecoration: 'none',
                color: 'inherit',
            }}
          >
            <div className="term-index-item">
                <span className="ti-num">{sub[0]}</span>
                <span className="ti-name v6-link">{sub[1]}</span>
                <span className="ti-pos">{sub[3]}</span>
                <span className="ti-stamp">◷ {sub[7]}</span>
            </div>
          </Link>
          </div>
        ))}
      </div>
    </div>
  );
}