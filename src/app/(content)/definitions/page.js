'use client'
import React from 'react'
import chapters from '../../../data/def.js'
import Link from 'next/link.js'
import './definitions.css'
import Image from 'next/image.js'

export default function Definitions() {
  return (
    <div>
      
    <div className="hdr-right">
        {/* <input className="hdr-search" id="searchInput" type="text" placeholder="Search 360 terms..." oninput="doSearch(this.value)"> */}
        {/* <a className="hdr-home" onclick="showMaster()" href="#">◎ Home</a> */}
    </div>

    <div id="view-master" className="view active">
        <h1 className="master-title">DogStar <span>Definitions</span></h1>
        <p className="master-sub">A Financial Orientation Compendium</p>
        <p className="master-tag">18 Chapters · 20 Terms · 360° · ◷ 00:00 → 59:50</p>
        {/* <div className="clock-wrap" onclick="window.location.href=FFC_URL"> */}
      
        
        {/* </div> */}
        <div className="clock-wrap">
            <Image
                src='/def.png'
                alt="Definitions Clock"
                width={680}
                height={680}
            />
        </div>
        <p className="master-hint"><span>Select a chapter below</span></p>
    </div>
       
        <div id="chapterGrid" className="chapter-grid">

            {chapters.map((chapter) => (
                <Link
                    key={chapter.id}
                    href={`/definitions/${chapter.id}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                <div className="chapter-item">
                    <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.3rem'}}>
                        <span style={{fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', color: 'var(--orange)', lineHeight: '1'}}>{chapter.num}</span>
                        <span className="v6-link" style={{fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem', color: 'var(--white)', letterSpacing: '0.05em'}}>{chapter.title}</span>
                    </div>
                        <span className="asterisk-supp">{chapter.supplement ? 'This Chapter includes a supplement *' : null}</span>
                    <div style={{fontFamily: "'Space Mono',monospace", fontSize: '0.68rem', color: 'var(--mgray)', letterSpacing: '0.08em'}}>{chapter.terms[0][7]} - {chapter.terms[19][7]}</div>
                </div>
                </Link>
            ))}
        </div>

        {/* <!-- FFC footer area --> */}
       
    </div>
    
  )
}
