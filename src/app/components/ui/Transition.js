'use client'
import React from 'react'
import Image from 'next/image'
import mcam2 from '@/assets/mcam2.svg'
import mcam from '@/assets/mcam1.svg'


export default function Transition() {
  return (
    <div className="transition-image">
      <Image
        src={mcam}
        alt="Money clock Lets"
        fill
        className="object-contain"
        style={{
          animation: 'crossfade 9s infinite',
          opacity: 0
        }}
        priority
      />
      <Image
        src={mcam2}
        alt="Frame 2"
        fill
        className="object-contain absolute inset-0"
        style={{
          animation: 'crossfade 9s infinite reverse', // reverse to alternate
          opacity: 1,
        }}
        priority
      />
    </div>
  )
}
