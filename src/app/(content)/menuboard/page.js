import React from 'react'
import Image from 'next/image'

export default function MenuBoard() {
  return (
    <div className="menu-container">
      <Image 
        src="/menu.png"
        alt="Menu Board"
        width={795}
        height={1227}
        className='hero-image'
        // sizes="(max-width: 600px) 100vw"
      />
    </div>
  )
}
