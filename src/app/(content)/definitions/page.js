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
                width={480}
                height={480}
            />
        </div>
        <p className="master-hint">Select a chapter below &nbsp;·&nbsp; <span>or search above</span></p>
    </div>
       
        <div id="chapterGrid" style={{maxWidth: '860px', margin: '2.5rem auto 0', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.6rem'}}>

            {chapters.map((chapter) => (
                <Link
                    key={chapter.id}
                    href={`/definitions/${chapter.id}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                <div style={{border: '1px solid rgba(245, 240, 232, 0.1)', padding: '0.85rem 1rem', cursor: 'pointer', transition: '0.15s', background: 'var(--offblack)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.3rem'}}>
                        <span style={{fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', color: 'var(--orange)', lineHeight: '1'}}>{chapter.num}</span>
                        <span className="v6-link" style={{fontFamily: "'Bebas Neue',sans-serif", fontSize: '1rem', color: 'var(--white)', letterSpacing: '0.05em'}}>{chapter.title}</span>
                    </div>
                    <div style={{fontFamily: "'Space Mono',monospace", fontSize: '0.48rem', color: 'var(--mgray)', letterSpacing: '0.08em'}}>{chapter.terms[0][7]} - {chapter.terms[19][7]}</div>
                </div>
                </Link>
            ))}
        </div>

        {/* <!-- FFC footer area --> */}
       
    </div>
    
  )
}
