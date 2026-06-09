import chapters from '@/data/def'

function normalizeLabel(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

const chapterIdByTitle = chapters.reduce((lookup, chapter) => {
  lookup[normalizeLabel(chapter.title)] = chapter.id
  return lookup
}, {})

export function getDefinitionHref(label) {
  if (!label) return '/orientation/definitions'

  if (normalizeLabel(label) === normalizeLabel('All: Fair Game')) {
    return '/orientation/definitions'
  }

  const chapterId = chapterIdByTitle[normalizeLabel(label)]

  return chapterId ? `/orientation/definitions/${chapterId}` : '/orientation/definitions'
}
