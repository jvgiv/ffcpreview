'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { getFirebaseAuth } from '@/lib/firebase/auth'

export default function Header() {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [authUser, setAuthUser] = useState(null)
  const profileMenuRef = useRef(null)
  const homeSectionLinks = [
    { href: '/#problem', label: 'The Problem' },
    { href: '/#solution', label: 'The Guide' },
    { href: '/#plan', label: 'The Process' },
    { href: '/#pricing', label: 'MenuBoard' },
    { href: '/#definitions-preview', label: 'Definitions' },
    { href: '/#scorecard', label: 'ScoreCard' },
    { href: '/#cta', label: 'Punch The Clock' },
  ]

  useEffect(() => {
    const auth = getFirebaseAuth()

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user)

      if (!user) {
        setIsProfileMenuOpen(false)
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileMenuOpen])

  const handleMenuToggle = () => {
    setIsProfileMenuOpen(false)
    setIsMenuOpen((current) => !current)
  }

  const handleNavClose = () => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }

  const handleProfileMenuToggle = () => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen((current) => !current)
  }

  const handleLogout = async () => {
    await signOut(getFirebaseAuth())
    handleNavClose()
    window.location.assign('/')
  }

  return (
    <nav className={`ffc-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
      <button
        type="button"
        className={`ffc-nav-toggle ${isMenuOpen ? 'active' : ''}`}
        aria-expanded={isMenuOpen}
        aria-controls="ffc-nav-links"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={handleMenuToggle}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className="ffc-nav-links">
        <li className="ffc-nav-item ffc-nav-item-home">
          <Link
            className={`ffc-nav-link ${pathName === "/" ? "active" : "" }`}
            href="/"
            onClick={handleNavClose}
          >
            HOME
          </Link>
          <ul className="ffc-home-menu" aria-label="Home section links">
            {homeSectionLinks.map((item) => (
              <li key={item.href}>
                <Link className="ffc-home-menu-link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        {/* <li className="ffc-nav-item">
          <Link
            className={`ffc-nav-link ${pathName === "/menuboard" ? "active" : "" }`}
            href="/menuboard"
            onClick={handleNavClose}
          >
            MENU BOARD
          </Link>
        </li>
        <li className="ffc-nav-item">
          <Link
            className={`ffc-nav-link ${pathName === "/scorecard" ? "active" : "" }`}
            href="/scorecard"
            onClick={handleNavClose}
          >
            SCORECARD
          </Link>
        </li> */}
        <li className="ffc-nav-item">
          <Link
            className={`ffc-nav-link ${pathName === "/caddybook" ? "active" : "" }`}
            href="/caddybook"
            onClick={handleNavClose}
          >
            CADDY BOOK
          </Link>
        </li>
        <li className="ffc-nav-item">
          <Link
            className={`ffc-nav-link ${pathName === "/thoughtgallery" ? "active" : "" }`}
            href="/thoughtgallery"
            onClick={handleNavClose}
          >
            THOUGHT GALLERY
          </Link>
        </li>
        <li className="ffc-nav-item">
          <Link
            className={`ffc-nav-link ${pathName === "/definitions" ? "active" : "" }`}
            href="/definitions"
            onClick={handleNavClose}
          >
            GUIDED ORIENTATION
          </Link>
        </li>
        <li className="ffc-nav-item">
          <Link
            className={`ffc-nav-link ${pathName === "/about" ? "active" : "" }`}
            href="/about"
            onClick={handleNavClose}
          >
            ABOUT
          </Link>
        </li>
      </ul>

      <div id="ffc-nav-links" className={`ffc-nav-mobile-panel ${isMenuOpen ? 'open' : ''}`}>
        <ul className="ffc-nav-mobile-links">
          <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/" ? "active" : "" }`}
              href="/"
              onClick={handleNavClose}
            >
              HOME
            </Link>
            <ul className="ffc-home-mobile-menu" aria-label="Home section links">
              {homeSectionLinks.map((item) => (
                <li key={item.href}>
                  <Link className="ffc-home-menu-link" href={item.href} onClick={handleNavClose}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {/* <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/menuboard" ? "active" : "" }`}
              href="/menuboard"
              onClick={handleNavClose}
            >
              MENU BOARD
            </Link>
          </li>
          <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/scorecard" ? "active" : "" }`}
              href="/scorecard"
              onClick={handleNavClose}
            >
              SCORECARD
            </Link>
          </li> */}
          <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/caddybook" ? "active" : "" }`}
              href="/caddybook"
              onClick={handleNavClose}
            >
              CADDY BOOK
            </Link>
          </li>
          <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/thoughtgallery" ? "active" : "" }`}
              href="/thoughtgallery"
              onClick={handleNavClose}
            >
              THOUGHT GALLERY
            </Link>
          </li>
          <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/definitions" ? "active" : "" }`}
              href="/definitions"
              onClick={handleNavClose}
            >
              DOGSTAR DEFINITIONS
            </Link>
          </li>
          <li className="ffc-nav-mobile-item">
            <Link
              className={`ffc-nav-link ${pathName === "/about" ? "active" : "" }`}
              href="/about"
              onClick={handleNavClose}
            >
              ABOUT
            </Link>
          </li>
          {!authUser ? (
            <li className="ffc-nav-mobile-item">
              <Link
                className="ffc-nav-cta ffc-nav-cta-mobile"
                href="/login"
                onClick={handleNavClose}
              >
                LOG IN
              </Link>
            </li>
          ) : null}
          <li className="ffc-nav-mobile-item">
            <Link
              className="ffc-nav-cta ffc-nav-cta-mobile"
              href="/#pricing"
              onClick={handleNavClose}
            >
              GET ORIENTED
            </Link>
          </li>
        </ul>
      </div>

      <Link className="ffc-nav-brand" href="/">
        FAR FLUNG CHANGE
      </Link>
      {authUser ? (
        <div className="ffc-nav-profile" ref={profileMenuRef}>
          <button
            type="button"
            className={`ffc-nav-profile-button ${isProfileMenuOpen ? 'active' : ''}`}
            aria-expanded={isProfileMenuOpen}
            aria-controls="ffc-profile-menu"
            aria-haspopup="menu"
            aria-label={isProfileMenuOpen ? 'Close profile menu' : 'Open profile menu'}
            onClick={handleProfileMenuToggle}
          >
            <FontAwesomeIcon icon={faCircleUser} />
          </button>
          <ul
            id="ffc-profile-menu"
            className={`ffc-nav-profile-menu ${isProfileMenuOpen ? 'open' : ''}`}
            role="menu"
            aria-label="Profile menu"
          >
            <li role="none">
              <Link
                className="ffc-nav-profile-link"
                href="/logged-in"
                role="menuitem"
                onClick={handleNavClose}
              >
                Home
              </Link>
            </li>
            <li role="none">
              <button
                type="button"
                className="ffc-nav-profile-link ffc-nav-profile-action"
                role="menuitem"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <Link
          className="ffc-nav-cta"
          href="/login"
        >
          LOG IN
        </Link>
      )}
    </nav>
  )
}
