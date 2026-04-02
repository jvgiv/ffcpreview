import React, { useEffect, useState } from 'react'
import '../../(content)/caddybook/caddybook.css'

const SUMMARY_FIELDS = [
  ['position', 'Position', 'where you are'],
  ['terrain', 'Terrain', 'what surrounds you'],
  ['forces', 'Forces', "what's acting on you"],
  ['questions', 'Questions', 'what matters now'],
  ['pace', 'Pace', 'where tempo ties in'],
  ['options', 'Options', 'how to scan for lines'],
  ['readiness', 'Readiness', 'when clarity compounds'],
]

export default function SummaryPage({ notes, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftNotes, setDraftNotes] = useState(notes)

  useEffect(() => {
    if (!isEditing) {
      setDraftNotes(notes)
    }
  }, [notes, isEditing])

  const handleDraftChange = (key, value) => {
    setDraftNotes(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCancel = () => {
    setDraftNotes(notes)
    setIsEditing(false)
  }

  const handleSave = () => {
    onSave?.(draftNotes)
    setIsEditing(false)
  }

  return (
    <>
      <div className="doc-header">
        <span className="brand-left">Far Flung Change · the Caddy Book</span>
        <span className="brand-right">Forging Fog Into Focus</span>
      </div>
      <div className="summary-page">
        <div className="summary-outer">
          <div className="summary-header">
            <span className="sh-brand">FAR FLUNG CHANGE</span>
            <span className="sh-right">the Caddy Book</span>
          </div>
          <div className="summary-title-bar">
            <p>
              YOUR CADDY BOOK of <em><strong>ORIENTATION</strong></em>
            </p>
            <div className="summary-toolbar">
              {isEditing ? (
                <>
                  <button
                    className="summary-action-btn primary"
                    type="button"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="summary-action-btn"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="summary-action-btn primary"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Summary
                </button>
              )}
            </div>
          </div>
          <div className="summary-grid">
            {SUMMARY_FIELDS.map(([key, title, subtitle], index) => (
              <div className="summary-row" key={key}>
                <div className="summary-item">
                  <div className="summary-num">{index + 1}</div>
                  <div className="summary-item-text">
                    <strong>{title}</strong>
                    <em>{subtitle}</em>
                  </div>
                </div>
                <div className="summary-notes-entry">
                  {isEditing ? (
                    <textarea
                      className="summary-note-input"
                      value={draftNotes[key] || ''}
                      onChange={(e) => handleDraftChange(key, e.target.value)}
                    />
                  ) : (
                    <span className="sn-placeholder">
                      {notes[key] || 'No note yet'}
                    </span>
                  )}
                  <div className="sn-line"></div>
                  <div className="sn-line light"></div>
                  <div className="sn-line light"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-footer">
            <p>Each element has its own page. Space for notes included.</p>
          </div>
          <div className="summary-forging">
            <p>Forging Fog Into Focus</p>
          </div>
        </div>
      </div>
    </>
  )
}
