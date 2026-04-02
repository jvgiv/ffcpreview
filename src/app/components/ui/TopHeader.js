'use client'
import React from 'react'
import Image from 'next/image'
import instagram from '../../../../public/instagram.svg'
import facebook from '../../../../public/facebook.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'


export default function TopHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlHeader = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // hide only after scrolling past 100px
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', controlHeader)

    return () => {
      window.removeEventListener('scroll', controlHeader)
    }
  }, [lastScrollY])

  return (
    <div className={`footer-container transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="topheader-cont">

      <div className="topheader-left">
        <div className="top-icon-labels">
          <a href="https://www.firstfinancialadvisory.com" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon
          icon={faGlobe}
          />
        <span>firstfinancialadvisory.com</span>
          </a>
        </div>
        <div className="top-icon-labels">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          />
        <span className="">85 Beach Street, Westerly, RI 02891</span>
        </div>
      </div>
      <div className='topheader-right'>
        <a className="footer-text" href="https://www.facebook.com/farflungchange/" target="_blank" rel="noopener noreferrer">
          <Image
            src={facebook}
            alt="fb"
            width={30}
            className="text-black"
            />
        </a>
            {/* <a className="footer-text" href="https://www.instagram.com/p/DTETA9pgLll/" target="_blank" rel="noopener noreferrer">
            <Image
            src={instagram}
            alt="fb"
            width={30}
            className="footer-child"
            />
            </a> */}
            </div>
            </div>
    </div>
  )
}
