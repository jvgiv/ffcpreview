import React from 'react'
import Image from 'next/image'

export default function Pic({
    image,
    alt
}) {
  return (
    <div className="tgpic-container">
      <Image
        alt={alt}
        src={image}
        width={330}
        height={330}
        sizes="(max-width: 600px) 80vw, 10px"
        placeholder='blur'
      />
    </div>
  )
}
