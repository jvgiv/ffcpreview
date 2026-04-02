import React from 'react'
import CaddyBookCover from './CaddyBookCover'
import CaddyBookTOC from './CaddyBookTOC'
import ElementPage from './ElementPage'
import SummaryPage from './SummaryPage'
import ScorecardPage from './ScoreCardPage'
import ClosingPage from './ClosingPage'

export default function CurrentPage({ index, data, notes, handleChange }) {
    const elementIndex = index - 2;

    if (index === 0) return <CaddyBookCover />
    if (index === 1) return <CaddyBookTOC />
    if (index >= 2 && index <= 8) {
        const element = data[elementIndex]

        return (
            <ElementPage
                element={element}
                note={notes[element.slug]}
                handleChange={(e) => handleChange(element.slug, e.target.value)}
            />
        )
    }
    if (index === 9) return <SummaryPage elements={data.elements} notes={notes} onSave={(nextNotes) => handleChangeBulk(handleChange, nextNotes, notes)} />
    if (index === 10) return <ScorecardPage scorecard={data.scorecard} />
    if (index === 11) return <ClosingPage closing={data.closing} />
}

function handleChangeBulk(handleChange, nextNotes, currentNotes) {
    Object.entries(nextNotes).forEach(([key, value]) => {
        if (currentNotes[key] !== value) {
            handleChange(key, value)
        }
    })
}
