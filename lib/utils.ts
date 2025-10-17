import { CHORD_COLORS, CHROMATIC_NOTES, CHROMATIC_NOTE_COLORS, GUITAR_STRINGS, SCALE_FORMULAS, STRING_STARTING_NOTES } from "@/lib/constants"
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFretNote = (stringNote: string, fret: number): string => {
  let startingIndex: number

  if (stringNote === "E" && GUITAR_STRINGS.indexOf(stringNote) === 5) {
    startingIndex = STRING_STARTING_NOTES.E_low
  } else {
    startingIndex = STRING_STARTING_NOTES[stringNote as keyof typeof STRING_STARTING_NOTES]
  }

  const noteIndex = (startingIndex + fret) % 12
  return CHROMATIC_NOTES[noteIndex]
}

export const getNoteColor = (
  note: string,
  selectedKey: string | null,
  analysis: { roman: string; chord: string }[] | null,
): string | null => {
  if (!selectedKey || !analysis) {
    return CHROMATIC_NOTE_COLORS[note as keyof typeof CHROMATIC_NOTE_COLORS] || "rgb(107, 114, 128)"
  }

  const chordIndex = analysis.findIndex((chord) => {
    const chordRoot = chord.chord.replace(/[m°]/g, "")

    const enharmonicMap: { [key: string]: string[] } = {
      "C#": ["C#", "Db"],
      "D#": ["D#", "Eb"],
      "F#": ["F#", "Gb"],
      "G#": ["G#", "Ab"],
      "A#": ["A#", "Bb"],
    }

    if (chordRoot === note) return true

    for (const [key, equivalents] of Object.entries(enharmonicMap)) {
      if (equivalents.includes(chordRoot) && equivalents.includes(note)) {
        return true
      }
    }

    return false
  })

  return chordIndex !== -1 ? CHORD_COLORS[chordIndex] : null
}

export const isNoteInScale = (
  note: string,
  selectedKey: string | null,
  analysis: { roman: string; chord: string }[] | null,
): boolean => {
  if (!selectedKey || !analysis) return true

  return analysis.some((chord) => {
    const chordRoot = chord.chord.replace(/[m°]/g, "")

    const enharmonicMap: { [key: string]: string[] } = {
      "C#": ["C#", "Db"],
      "D#": ["D#", "Eb"],
      "F#": ["F#", "Gb"],
      "G#": ["G#", "Ab"],
      "A#": ["A#", "Bb"],
    }

    if (chordRoot === note) return true

    for (const [key, equivalents] of Object.entries(enharmonicMap)) {
      if (equivalents.includes(chordRoot) && equivalents.includes(note)) {
        return true
      }
    }

    return false
  })
}

export const getScaleNotes = (rootKey: string, mode: string): string[] => {
  const formula = SCALE_FORMULAS[mode as keyof typeof SCALE_FORMULAS]
  if (!formula) return []

  const rootIndex = CHROMATIC_NOTES.indexOf(rootKey)
  if (rootIndex === -1) return []

  return formula.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12
    return CHROMATIC_NOTES[noteIndex]
  })
}

export const getEnharmonicScaleNotes = (rootKey: string, mode: string): string[] => {
  const formula = SCALE_FORMULAS[mode as keyof typeof SCALE_FORMULAS]
  if (!formula) return []

  const enharmonicMap: { [key: string]: string } = {
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb",
  }

  const enharmonicKey = enharmonicMap[rootKey]
  if (!enharmonicKey) return []

  const rootIndex = CHROMATIC_NOTES.indexOf(rootKey)
  if (rootIndex === -1) return []

  return formula.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12
    const note = CHROMATIC_NOTES[noteIndex]

    const flatMap: { [key: string]: string } = {
      "C#": "Db",
      "D#": "Eb",
      "F#": "Gb",
      "G#": "Ab",
      "A#": "Bb",
    }

    return flatMap[note] || note
  })
}

export const isAccidentalKey = (key: string): boolean => {
  return key.includes("#") || key.includes("b")
}