import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons'

export default function TempFooter() {
  return (
    <section className="ffc-footer">
      <div className="ffc-footer-inner container">
        <div className="ffc-footer-brand">
          <p className="ffc-footer-name">FAR FLUNG CHANGE</p>
          <p className="ffc-footer-note">Practical financial orientation for real-world decisions.</p>
        </div>

        <div className="ffc-footer-contact">
          <a className="ffc-footer-item" href="https://www.firstfinancialadvisory.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGlobe} />
            <span>Powered by firstfinancialadvisory.com</span>
          </a>
          <div className="ffc-footer-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>85 Beach Street, Westerly, RI 02891</span>
          </div>
          <a className="ffc-footer-item" href="tel:4015960193">
            <FontAwesomeIcon icon={faPhone} />
            <span>401-596-0193</span>
          </a>
          <a className="ffc-footer-item" href="mailto:farflungchange@1stallied.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>farflungchange@1stallied.com</span>
          </a>
        </div>

        <div className="ffc-footer-social">
          <a className="ffc-footer-social-link" href="https://www.facebook.com/farflungchange/" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
      </div>
    </section>
  )
}
