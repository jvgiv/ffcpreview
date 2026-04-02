// src/components/SubSideNav.js
'use client';

import Link from 'next/link';
import '../(content)/definitions/definitions.css';

export default function SubSideNav({ chapterId, currentSubId, terms, title, number }) {
  return (
    <div className="chapter-panel">
      <div id="panelLabel" className="panel-label">
        {number} {title}
      </div>

      <div id="chapterPanel">

      
        {terms.map((term) => {
          const [number, title] = term;
          const isActive = number === currentSubId;

          return (
            <Link
              key={number}
              href={`/definitions/${chapterId}/${number}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
              className={`block px-4 py-3 rounded-xl text-sm transition-all hover:bg-white
                ${isActive 
                  ? 'bg-white shadow-sm border border-gray-300 font-medium' 
                  : 'hover:shadow-sm'
                }`}
            >
                <div id={`panel_${number}`} className={`panel-item ${isActive ? 'current' : ''}`}>
                    <span className="pi-num">{number}</span>
                    <span className="pi-name">
                        {title}
                    </span>
                    <span className='pi-dot'></span>
                    </div>
            </Link>
          );
        })}
        </div>
      </div>
  );
}