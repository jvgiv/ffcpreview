'use client'
import React from 'react'
import { useState } from 'react'
import './caddybook.css'
import NavBar from '@/app/components/caddybook/CaddyNavBar'
import CurrentPage from '@/app/components/caddybook/CurrentPage'
import elements from '../../../data/caddybook.js'
import { useAuth } from '@/app/components/auth/AuthProvider'
import emailjs from '@emailjs/browser'

const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
const publicKeyEnv = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const PAGES = [
  { id: 'cover',     title: 'Cover',      sub: 'far flung change' },
  { id: 'toc',       title: 'The Course', sub: 'seven elements' },
  { id: 'el-1',      title: 'Position',   sub: 'where you are' },
  { id: 'el-2',      title: 'Terrain',    sub: 'what surrounds you' },
  { id: 'el-3',      title: 'Forces',     sub: "what's acting on you" },
  { id: 'el-4',      title: 'Questions',  sub: 'what matters now' },
  { id: 'el-5',      title: 'Pace',       sub: 'where tempo ties in' },
  { id: 'el-6',      title: 'Options',    sub: 'how to scan for lines' },
  { id: 'el-7',      title: 'Readiness',  sub: 'when clarity compounds' },
  { id: 'notes',     title: 'Your Notes', sub: 'summary of all elements' },
  { id: 'scorecard', title: 'Scorecard',  sub: 'orientation scorecard' },
  { id: 'closing',   title: 'Next Steps', sub: 'momentum begins here' },
]

export default function CaddyBook() {
    const { authUser, profile } = useAuth()
    const [current, setCurrent] = useState(0)
    const [notes, setNotes] = useState({
      position: '',
      terrain: '',
      forces: '',
      questions: '',
      pace: '',
      options: '',
      readiness: '',
      email: profile?.email || '',
      displayName: profile?.displayName || '',
      phoneNumber: profile?.phoneNumber || '',
      zipCode: profile?.zipCode || '',
      ageRange: profile?.ageRange || '',
    })
    
    const handleChange = (slug, value) => {
      setNotes(prev => ({
        ...prev,
        [slug]: value,
      }))
    }

    function goTo(n) {
    setCurrent(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      serviceId,
      templateId,
      notes,
      { publicKey: publicKeyEnv }
    )
    .then(() => {
      setCurrent(13)
    })
    .catch((error) => {
      // console.error('EmailJS error:', error);
      setCurrent(12)
    });
  }

  const page = PAGES[current]
  const memberProfile = {
    displayName: profile?.displayName || authUser?.displayName || '',
    zipCode: profile?.zipCode || '',
    ageRange: profile?.ageRange || '',
  }

  return (
    <div className="page">
      <CurrentPage 
        index={current} 
        data={elements} 
        notes={notes}
        handleChange={handleChange}
        memberProfile={memberProfile}
        handleSubmit={handleSubmit}
        onRetrySubmit={() => goTo(current - 1)}
      />
      <NavBar 
        pages={PAGES}
        current={current}
        onPrev={() => goTo(current - 1)}
        onNext={() => goTo(current + 1)}
      />
    </div>
  )
}
