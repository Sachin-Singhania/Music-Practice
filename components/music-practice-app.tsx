"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Pause, RotateCcw, Music, Settings } from "lucide-react"

const KEYS = [
  { name: "C", enharmonic: null },
  { name: "C#", enharmonic: "Db" },
  { name: "D", enharmonic: null },
  { name: "D#", enharmonic: "Eb" },
  { name: "E", enharmonic: null },
  { name: "F", enharmonic: null },
  { name: "F#", enharmonic: "Gb" },
  { name: "G", enharmonic: null },
  { name: "G#", enharmonic: "Ab" },
  { name: "A", enharmonic: null },
  { name: "A#", enharmonic: "Bb" },
  { name: "B", enharmonic: null },
]

const ALL_MODES = [
  "Major (Ionian)",
  "Dorian",
  "Phrygian",
  "Lydian",
  "Mixolydian",
  "Aeolian (Minor)",
  "Locrian",
  "Major Pentatonic",
  "Minor Pentatonic",
  "Minor Blues",
  "Major Blues",
  "Melodic Minor",
  "Harmonic Minor",
  "Hungarian Scale",
]

const TIME_SIGNATURES = ["1/4", "2/4", "3/4", "4/4"]

const CIRCLE_OF_FIFTHS_MAJOR = ["C", "G", "D", "A", "E", "B", "F#/Gb", "Db", "Ab", "Eb", "Bb", "F"]

const CIRCLE_OF_FIFTHS_MINOR = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m/Ebm", "Bbm", "Fm", "Cm", "Gm", "Dm"]

const MAJOR_ROMAN_NUMERALS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
const MINOR_ROMAN_NUMERALS = ["i", "ii°", "III", "iv", "v", "VI", "VII"]

const CHORD_PROGRESSIONS = {
  // Major Keys
  C: [
    { roman: "I", chord: "C" },
    { roman: "ii", chord: "Dm" },
    { roman: "iii", chord: "Em" },
    { roman: "IV", chord: "F" },
    { roman: "V", chord: "G" },
    { roman: "vi", chord: "Am" },
    { roman: "vii°", chord: "B°" },
  ],
  G: [
    { roman: "I", chord: "G" },
    { roman: "ii", chord: "Am" },
    { roman: "iii", chord: "Bm" },
    { roman: "IV", chord: "C" },
    { roman: "V", chord: "D" },
    { roman: "vi", chord: "Em" },
    { roman: "vii°", chord: "F#°" },
  ],
  D: [
    { roman: "I", chord: "D" },
    { roman: "ii", chord: "Em" },
    { roman: "iii", chord: "F#m" },
    { roman: "IV", chord: "G" },
    { roman: "V", chord: "A" },
    { roman: "vi", chord: "Bm" },
    { roman: "vii°", chord: "C#°" },
  ],
  A: [
    { roman: "I", chord: "A" },
    { roman: "ii", chord: "Bm" },
    { roman: "iii", chord: "C#m" },
    { roman: "IV", chord: "D" },
    { roman: "V", chord: "E" },
    { roman: "vi", chord: "F#m" },
    { roman: "vii°", chord: "G#°" },
  ],
  E: [
    { roman: "I", chord: "E" },
    { roman: "ii", chord: "F#m" },
    { roman: "iii", chord: "G#m" },
    { roman: "IV", chord: "A" },
    { roman: "V", chord: "B" },
    { roman: "vi", chord: "C#m" },
    { roman: "vii°", chord: "D#°" },
  ],
  B: [
    { roman: "I", chord: "B" },
    { roman: "ii", chord: "C#m" },
    { roman: "iii", chord: "D#m" },
    { roman: "IV", chord: "E" },
    { roman: "V", chord: "F#" },
    { roman: "vi", chord: "G#m" },
    { roman: "vii°", chord: "A#°" },
  ],
  "F#/Gb": [
    { roman: "I", chord: "F#" },
    { roman: "ii", chord: "G#m" },
    { roman: "iii", chord: "A#m" },
    { roman: "IV", chord: "B" },
    { roman: "V", chord: "C#" },
    { roman: "vi", chord: "D#m" },
    { roman: "vii°", chord: "E#°" },
  ],
  Db: [
    { roman: "I", chord: "Db" },
    { roman: "ii", chord: "Ebm" },
    { roman: "iii", chord: "Fm" },
    { roman: "IV", chord: "Gb" },
    { roman: "V", chord: "Ab" },
    { roman: "vi", chord: "Bbm" },
    { roman: "vii°", chord: "C°" },
  ],
  Ab: [
    { roman: "I", chord: "Ab" },
    { roman: "ii", chord: "Bbm" },
    { roman: "iii", chord: "Cm" },
    { roman: "IV", chord: "Db" },
    { roman: "V", chord: "Eb" },
    { roman: "vi", chord: "Fm" },
    { roman: "vii°", chord: "G°" },
  ],
  Eb: [
    { roman: "I", chord: "Eb" },
    { roman: "ii", chord: "Fm" },
    { roman: "iii", chord: "Gm" },
    { roman: "IV", chord: "Ab" },
    { roman: "V", chord: "Bb" },
    { roman: "vi", chord: "Cm" },
    { roman: "vii°", chord: "D°" },
  ],
  Bb: [
    { roman: "I", chord: "Bb" },
    { roman: "ii", chord: "Cm" },
    { roman: "iii", chord: "Dm" },
    { roman: "IV", chord: "Eb" },
    { roman: "V", chord: "F" },
    { roman: "vi", chord: "Gm" },
    { roman: "vii°", chord: "A°" },
  ],
  F: [
    { roman: "I", chord: "F" },
    { roman: "ii", chord: "Gm" },
    { roman: "iii", chord: "Am" },
    { roman: "IV", chord: "Bb" },
    { roman: "V", chord: "C" },
    { roman: "vi", chord: "Dm" },
    { roman: "vii°", chord: "E°" },
  ],
  // Minor Keys
  Am: [
    { roman: "i", chord: "Am" },
    { roman: "ii°", chord: "B°" },
    { roman: "III", chord: "C" },
    { roman: "iv", chord: "Dm" },
    { roman: "v", chord: "Em" },
    { roman: "VI", chord: "F" },
    { roman: "VII", chord: "G" },
  ],
  Em: [
    { roman: "i", chord: "Em" },
    { roman: "ii°", chord: "F#°" },
    { roman: "III", chord: "G" },
    { roman: "iv", chord: "Am" },
    { roman: "v", chord: "Bm" },
    { roman: "VI", chord: "C" },
    { roman: "VII", chord: "D" },
  ],
  Bm: [
    { roman: "i", chord: "Bm" },
    { roman: "ii°", chord: "C#°" },
    { roman: "III", chord: "D" },
    { roman: "iv", chord: "Em" },
    { roman: "v", chord: "F#m" },
    { roman: "VI", chord: "G" },
    { roman: "VII", chord: "A" },
  ],
  "F#m": [
    { roman: "i", chord: "F#m" },
    { roman: "ii°", chord: "G#°" },
    { roman: "III", chord: "A" },
    { roman: "iv", chord: "Bm" },
    { roman: "v", chord: "C#m" },
    { roman: "VI", chord: "D" },
    { roman: "VII", chord: "E" },
  ],
  "C#m": [
    { roman: "i", chord: "C#m" },
    { roman: "ii°", chord: "D#°" },
    { roman: "III", chord: "E" },
    { roman: "iv", chord: "F#m" },
    { roman: "v", chord: "G#m" },
    { roman: "VI", chord: "A" },
    { roman: "VII", chord: "B" },
  ],
  "G#m": [
    { roman: "i", chord: "G#m" },
    { roman: "ii°", chord: "A#°" },
    { roman: "III", chord: "B" },
    { roman: "iv", chord: "C#m" },
    { roman: "v", chord: "D#m" },
    { roman: "VI", chord: "E" },
    { roman: "VII", chord: "F#" },
  ],
  "D#m/Ebm": [
    { roman: "i", chord: "D#m" },
    { roman: "ii°", chord: "E#°" },
    { roman: "III", chord: "F#" },
    { roman: "iv", chord: "G#m" },
    { roman: "v", chord: "A#m" },
    { roman: "VI", chord: "B" },
    { roman: "VII", chord: "C#" },
  ],
  Bbm: [
    { roman: "i", chord: "Bbm" },
    { roman: "ii°", chord: "C°" },
    { roman: "iii", chord: "Db" },
    { roman: "iv", chord: "Ebm" },
    { roman: "v", chord: "Fm" },
    { roman: "vi", chord: "Gb" },
    { roman: "VII", chord: "Ab" },
  ],
  Fm: [
    { roman: "i", chord: "Fm" },
    { roman: "ii°", chord: "G°" },
    { roman: "iii", chord: "Ab" },
    { roman: "iv", chord: "Bbm" },
    { roman: "v", chord: "Cm" },
    { roman: "vi", chord: "Db" },
    { roman: "VII", chord: "Eb" },
  ],
  Cm: [
    { roman: "i", chord: "Cm" },
    { roman: "ii°", chord: "D°" },
    { roman: "iii", chord: "Eb" },
    { roman: "iv", chord: "Fm" },
    { roman: "v", chord: "Gm" },
    { roman: "vi", chord: "Ab" },
    { roman: "VII", chord: "Bb" },
  ],
  Gm: [
    { roman: "i", chord: "Gm" },
    { roman: "ii°", chord: "A°" },
    { roman: "iii", chord: "Bb" },
    { roman: "iv", chord: "Cm" },
    { roman: "v", chord: "Dm" },
    { roman: "vi", chord: "Eb" },
    { roman: "VII", chord: "F" },
  ],
  Dm: [
    { roman: "i", chord: "Dm" },
    { roman: "ii°", chord: "E°" },
    { roman: "iii", chord: "F" },
    { roman: "iv", chord: "Gm" },
    { roman: "v", chord: "Am" },
    { roman: "vi", chord: "Bb" },
    { roman: "VII", chord: "C" },
  ],
}

const CHORD_COLORS = [
  "rgb(16, 185, 129)", // I - Emerald (Tonic) - softer green
  "rgb(59, 130, 246)", // ii - Blue (Supertonic) - keeping blue
  "rgb(147, 51, 234)", // iii - Purple (Mediant) - deeper purple
  "rgb(56, 189, 248)", // IV - Sky Blue (Subdominant) - modern dark mode blue instead of harsh orange
  "rgb(236, 72, 153)", // V - Pink (Dominant) - vibrant pink
  "rgb(251, 191, 36)", // vi - Amber (Submediant) - warmer amber
  "rgb(148, 163, 184)", // vii° - Slate (Leading tone/diminished) - softer gray
]

const CHORD_FUNCTIONS = {
  major: ["tonic", "supertonic", "mediant", "subdominant", "dominant", "submediant", "leading tone"],
  minor: ["tonic", "supertonic", "mediant", "subdominant", "dominant", "submediant", "subtonic"],
}

const KEY_RELATIONSHIPS = {
  // Major keys and their relative minors
  C: { relative: "Am", parallel: "Cm" },
  G: { relative: "Em", parallel: "Gm" },
  D: { relative: "Bm", parallel: "Dm" },
  A: { relative: "F#m", parallel: "Am" },
  E: { relative: "C#m", parallel: "Em" },
  B: { relative: "G#m", parallel: "Bm" },
  "F#/Gb": { relative: "D#m/Ebm", parallel: "F#m/Gbm" },
  Db: { relative: "Bbm", parallel: "Dbm" },
  Ab: { relative: "Fm", parallel: "Abm" },
  Eb: { relative: "Cm", parallel: "Ebm" },
  Bb: { relative: "Gm", parallel: "Bbm" },
  F: { relative: "Dm", parallel: "Fm" },
  // Minor keys and their relative majors
  Am: { relative: "C", parallel: "A" },
  Em: { relative: "G", parallel: "E" },
  Bm: { relative: "D", parallel: "B" },
  "F#m": { relative: "A", parallel: "F#" },
  "C#m": { relative: "E", parallel: "C#" },
  "G#m": { relative: "B", parallel: "G#" },
  "D#m/Ebm": { relative: "F#/Gb", parallel: "D#/Eb" },
  Bbm: { relative: "Db", parallel: "Bb" },
  Fm: { relative: "Ab", parallel: "F" },
  Cm: { relative: "Eb", parallel: "C" },
  Gm: { relative: "Bb", parallel: "G" },
  Dm: { relative: "F", parallel: "D" },
}

const GUITAR_STRINGS = ["E", "B", "G", "D", "A", "E"] // High to low
const CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Standard guitar tuning starting fret positions
const STRING_STARTING_NOTES = {
  E: 4, // High E (4th octave)
  B: 11,
  G: 7,
  D: 2,
  A: 9,
  E_low: 4, // Low E (same as high E but different octave)
}

const CHROMATIC_NOTE_COLORS = {
  C: "rgb(244, 114, 182)", // Pink/rose
  "C#": "rgb(217, 179, 140)", // Tan/beige
  D: "rgb(163, 230, 53)", // Yellow-green
  "D#": "rgb(34, 197, 94)", // Darker green
  E: "rgb(16, 185, 129)", // Bright green
  F: "rgb(110, 231, 183)", // Light green
  "F#": "rgb(103, 232, 249)", // Light blue/cyan
  G: "rgb(59, 130, 246)", // Blue
  "G#": "rgb(147, 51, 234)", // Purple-blue
  A: "rgb(168, 85, 247)", // Purple
  "A#": "rgb(236, 72, 153)", // Magenta/pink
  B: "rgb(249, 115, 22)", // Bright pink/orange
}

const SCALE_FORMULAS = {
  "Major (Ionian)": [0, 2, 4, 5, 7, 9, 11],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  "Aeolian (Minor)": [0, 2, 3, 5, 7, 8, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
  "Major Pentatonic": [0, 2, 4, 7, 9],
  "Minor Pentatonic": [0, 3, 5, 7, 10],
  "Minor Blues": [0, 3, 5, 6, 7, 10],
  "Major Blues": [0, 2, 3, 4, 7, 9],
  "Melodic Minor": [0, 2, 3, 5, 7, 9, 11],
  "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
  "Hungarian Scale": [0, 2, 3, 6, 7, 8, 11],
}

const getFretNote = (stringNote: string, fret: number): string => {
  let startingIndex: number

  if (stringNote === "E" && GUITAR_STRINGS.indexOf(stringNote) === 5) {
    // Low E string
    startingIndex = STRING_STARTING_NOTES.E_low
  } else {
    startingIndex = STRING_STARTING_NOTES[stringNote as keyof typeof STRING_STARTING_NOTES]
  }

  const noteIndex = (startingIndex + fret) % 12
  return CHROMATIC_NOTES[noteIndex]
}

const getNoteColor = (
  note: string,
  selectedKey: string | null,
  analysis: { roman: string; chord: string }[] | null,
): string | null => {
  if (!selectedKey || !analysis) {
    return CHROMATIC_NOTE_COLORS[note as keyof typeof CHROMATIC_NOTE_COLORS] || "rgb(107, 114, 128)"
  }

  const chordIndex = analysis.findIndex((chord) => {
    const chordRoot = chord.chord.replace(/[m°]/g, "")

    // Handle enharmonic equivalents
    const enharmonicMap: { [key: string]: string[] } = {
      "C#": ["C#", "Db"],
      "D#": ["D#", "Eb"],
      "F#": ["F#", "Gb"],
      "G#": ["G#", "Ab"],
      "A#": ["A#", "Bb"],
    }

    // Check direct match
    if (chordRoot === note) return true

    // Check enharmonic equivalents
    for (const [key, equivalents] of Object.entries(enharmonicMap)) {
      if (equivalents.includes(chordRoot) && equivalents.includes(note)) {
        return true
      }
    }

    return false
  })

  return chordIndex !== -1 ? CHORD_COLORS[chordIndex] : null
}

const isNoteInScale = (
  note: string,
  selectedKey: string | null,
  analysis: { roman: string; chord: string }[] | null,
): boolean => {
  if (!selectedKey || !analysis) return true

  return analysis.some((chord) => {
    const chordRoot = chord.chord.replace(/[m°]/g, "")

    // Handle enharmonic equivalents
    const enharmonicMap: { [key: string]: string[] } = {
      "C#": ["C#", "Db"],
      "D#": ["D#", "Eb"],
      "F#": ["F#", "Gb"],
      "G#": ["G#", "Ab"],
      "A#": ["A#", "Bb"],
    }

    // Check direct match
    if (chordRoot === note) return true

    // Check enharmonic equivalents
    for (const [key, equivalents] of Object.entries(enharmonicMap)) {
      if (equivalents.includes(chordRoot) && equivalents.includes(note)) {
        return true
      }
    }

    return false
  })
}

const getScaleNotes = (rootKey: string, mode: string): string[] => {
  const formula = SCALE_FORMULAS[mode as keyof typeof SCALE_FORMULAS]
  if (!formula) return []

  const rootIndex = CHROMATIC_NOTES.indexOf(rootKey)
  if (rootIndex === -1) return []

  return formula.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12
    return CHROMATIC_NOTES[noteIndex]
  })
}

const getEnharmonicScaleNotes = (rootKey: string, mode: string): string[] => {
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

  // Find the root index using the sharp version first
  const rootIndex = CHROMATIC_NOTES.indexOf(rootKey)
  if (rootIndex === -1) return []

  return formula.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12
    const note = CHROMATIC_NOTES[noteIndex]

    // Convert sharps to flats for the flat version
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

const isAccidentalKey = (key: string): boolean => {
  return key.includes("#") || key.includes("b")
}

export function MusicPracticeApp() {
  const [bpm, setBpm] = useState([120])
  const [timeSignature, setTimeSignature] = useState("4/4")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentKey, setCurrentKey] = useState(KEYS[0])
  const [currentMode, setCurrentMode] = useState(ALL_MODES[0])
  const [beatCount, setBeatCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedModes, setSelectedModes] = useState<string[]>(ALL_MODES.slice(0, 7))
  const [showSettings, setShowSettings] = useState(false)
  const [selectedCircleKey, setSelectedCircleKey] = useState<string | null>(null)
  const [circleAnalysis, setCircleAnalysis] = useState<{ roman: string; chord: string }[] | null>(null)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playClick = useCallback((isAccent = false) => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(isAccent ? 800 : 600, audioContextRef.current.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + 0.1)

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 100)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm[0]
      const beatsPerMeasure = Number.parseInt(timeSignature.split("/")[0])

      intervalRef.current = setInterval(() => {
        setBeatCount((prev) => {
          const newCount = (prev % beatsPerMeasure) + 1
          playClick(newCount === 1)
          return newCount
        })
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, bpm, timeSignature, playClick])

  const toggleMetronome = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setBeatCount(0)
    }
  }

  const resetMetronome = () => {
    setIsPlaying(false)
    setBeatCount(0)
  }

  const generateRandomKeyAndMode = () => {
    const randomKey = KEYS[Math.floor(Math.random() * KEYS.length)]
    const availableModes = selectedModes.length > 0 ? selectedModes : ALL_MODES
    const randomMode = availableModes[Math.floor(Math.random() * availableModes.length)]
    setCurrentKey(randomKey)
    setCurrentMode(randomMode)
  }

  const toggleModeSelection = (mode: string) => {
    setSelectedModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]))
  }

  const toggleAllModes = () => {
    setSelectedModes((prev) => (prev.length === ALL_MODES.length ? [] : ALL_MODES))
  }

  const formatKeyDisplay = (key: (typeof KEYS)[0]) => {
    return key.enharmonic ? `${key.name}/${key.enharmonic}` : key.name
  }

  const handleCircleKeyClick = (key: string, isMinor = false) => {
    setSelectedCircleKey(key)
    const progression = CHORD_PROGRESSIONS[key as keyof typeof CHORD_PROGRESSIONS]
    if (progression) {
      setCircleAnalysis(progression)
    }
  }

  const clearCircleSelection = () => {
    setSelectedCircleKey(null)
    setCircleAnalysis(null)
  }

  const getChordColor = (key: string): string | null => {
    if (!selectedCircleKey || !circleAnalysis) return null

    const chordIndex = circleAnalysis.findIndex((chord) => {
      const chordName = chord.chord.replace(/°/g, "")

      if (chord.chord.includes("°")) {
        // Check if the minor version exists in the circle
        const minorVersion = chordName + "m"
        if (key === minorVersion) return true

        // Fallback to the original chord name if minor version doesn't match
        if (chordName === key) return true
      } else {
        // For non-diminished chords, use exact matching
        if (chordName === key) return true
      }

      // Handle enharmonic equivalents
      if (key.includes("/")) {
        const [key1, key2] = key.split("/")
        return chordName === key1 || chordName === key2
      }

      if (chordName.includes("/")) {
        const [chord1, chord2] = chordName.split("/")
        return chord1 === key || chord2 === key
      }

      return false
    })

    return chordIndex !== -1 ? CHORD_COLORS[chordIndex] : null
  }

  const isMinorKey = (key: string) => {
    return key.includes("m") && !key.includes("°")
  }

  const getKeyTypeDisplay = (key: string) => {
    return isMinorKey(key) ? "minor" : "major"
  }

  const beatsPerMeasure = Number.parseInt(timeSignature.split("/")[0])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-balance">Music Practice Studio</h1>
          </div>
          <p className="text-muted-foreground text-lg">{"Perfect your timing and explore musical scales"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Metronome</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center text-2xl font-bold transition-all duration-100 ${
                      isAnimating ? "metronome-tick bg-primary/20" : "bg-card"
                    }`}
                  >
                    {isPlaying ? beatCount : "•"}
                  </div>
                  {isAnimating && (
                    <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-primary pulse-ring"></div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                {Array.from({ length: beatsPerMeasure }, (_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-100 ${
                      isPlaying && beatCount === i + 1
                        ? "bg-primary border-primary"
                        : beatCount > i + 1 && isPlaying
                          ? "bg-primary/50 border-primary/50"
                          : "bg-muted border-border"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{bpm[0]}</div>
                  <div className="text-sm text-muted-foreground">BPM</div>
                </div>
                <Slider value={bpm} onValueChange={setBpm} min={30} max={240} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30</span>
                  <span>240</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Signature</label>
                <Select value={timeSignature} onValueChange={setTimeSignature}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SIGNATURES.map((sig) => (
                      <SelectItem key={sig} value={sig}>
                        {sig}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={toggleMetronome} size="lg" className="flex-1 max-w-32">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button onClick={resetMetronome} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                Key & Mode Generator
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="ml-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Key</div>
                  <div className="text-6xl font-bold text-primary">{formatKeyDisplay(currentKey)}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Mode</div>
                  <div className="text-2xl font-semibold text-accent">{currentMode}</div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">Notes in Scale</div>

                  {isAccidentalKey(currentKey.name) ? (
                    <div className="space-y-3">
                      {/* Sharp version */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground font-medium">
                          {currentKey.name} {currentMode} (Sharp version)
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {getScaleNotes(currentKey.name, currentMode).map((note, index) => (
                            <div
                              key={`scale-note-sharp-${index}`}
                              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm font-semibold"
                              style={{ color: "rgb(20, 184, 166)" }}
                            >
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flat version */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground font-medium">
                          {currentKey.enharmonic} {currentMode} (Flat version)
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {getEnharmonicScaleNotes(currentKey.name, currentMode).map((note, index) => (
                            <div
                              key={`scale-note-flat-${index}`}
                              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm font-semibold"
                              style={{ color: "rgb(20, 184, 166)" }}
                            >
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Single scale for natural keys */
                    <div className="flex flex-wrap justify-center gap-2">
                      {getScaleNotes(currentKey.name, currentMode).map((note, index) => (
                        <div
                          key={`scale-note-${index}`}
                          className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-sm font-semibold"
                          style={{ color: "rgb(20, 184, 166)" }}
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={generateRandomKeyAndMode} size="lg" className="w-full bg-transparent" variant="outline">
                <RotateCcw className="h-5 w-5 mr-2" />
                Generate New Key & Mode
              </Button>

              {showSettings && (
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Mode Selection
                      <Button variant="ghost" size="sm" onClick={toggleAllModes} className="text-xs">
                        {selectedModes.length === ALL_MODES.length ? "Deselect All" : "Select All"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground mb-3">
                      Selected: {selectedModes.length} of {ALL_MODES.length} modes
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {ALL_MODES.map((mode) => (
                        <div key={mode} className="flex items-center space-x-2">
                          <Checkbox
                            id={mode}
                            checked={selectedModes.includes(mode)}
                            onCheckedChange={() => toggleModeSelection(mode)}
                          />
                          <label
                            htmlFor={mode}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {mode}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Practice Suggestion:</h4>
                <p className="text-sm text-muted-foreground">
                  {"Practice scales, arpeggios, or improvisation in "}
                  <span className="font-medium text-foreground">
                    {formatKeyDisplay(currentKey)} {currentMode}
                  </span>
                  {" at your current tempo."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Active Modes ({selectedModes.length}):</h4>
                <div className="flex flex-wrap gap-1 text-xs">
                  {selectedModes.map((mode) => (
                    <div
                      key={mode}
                      className={`px-2 py-1 rounded transition-colors ${
                        mode === currentMode
                          ? "bg-primary/20 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground bg-muted/30"
                      }`}
                    >
                      {mode}
                    </div>
                  ))}
                  {selectedModes.length === 0 && (
                    <div className="p-2 text-muted-foreground text-center w-full">
                      No modes selected. Click the settings icon to choose modes.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Circle of Fifths</CardTitle>
            <div className="flex items-center justify-center gap-4">
              <p className="text-center text-muted-foreground">Click any key to see its chord progression</p>
              {selectedCircleKey && (
                <Button variant="outline" size="sm" onClick={clearCircleSelection} className="text-xs bg-transparent">
                  Clear Selection
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative w-96 h-96">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {CIRCLE_OF_FIFTHS_MAJOR.map((key, index) => {
                    const angle = (index * 30 - 90) * (Math.PI / 180)
                    const x = 200 + 150 * Math.cos(angle)
                    const y = 200 + 150 * Math.sin(angle)
                    const isSelected = selectedCircleKey === key
                    const chordColor = getChordColor(key)

                    return (
                      <g key={`major-${key}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="25"
                          className={`cursor-pointer transition-all duration-200 stroke-2 ${
                            isSelected
                              ? "fill-primary stroke-primary"
                              : chordColor
                                ? "stroke-border"
                                : "fill-muted hover:fill-primary/20 stroke-border stroke-1"
                          }`}
                          style={chordColor && !isSelected ? { fill: chordColor } : {}}
                          onClick={() => handleCircleKeyClick(key, false)}
                        />
                        <text
                          x={x}
                          y={y + 5}
                          textAnchor="middle"
                          className={`text-sm font-bold cursor-pointer ${
                            isSelected ? "fill-primary-foreground" : chordColor ? "fill-white" : "fill-foreground"
                          }`}
                          onClick={() => handleCircleKeyClick(key, false)}
                        >
                          {key}
                        </text>
                      </g>
                    )
                  })}

                  {CIRCLE_OF_FIFTHS_MINOR.map((key, index) => {
                    const angle = (index * 30 - 90) * (Math.PI / 180)
                    const x = 200 + 100 * Math.cos(angle)
                    const y = 200 + 100 * Math.sin(angle)
                    const isSelected = selectedCircleKey === key
                    const chordColor = getChordColor(key)

                    return (
                      <g key={`minor-${key}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="20"
                          className={`cursor-pointer transition-all duration-200 stroke-2 ${
                            isSelected
                              ? "fill-accent stroke-accent"
                              : chordColor
                                ? "stroke-border"
                                : "fill-muted/60 hover:fill-accent/20 stroke-border stroke-1"
                          }`}
                          style={chordColor && !isSelected ? { fill: chordColor } : {}}
                          onClick={() => handleCircleKeyClick(key, true)}
                        />
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          className={`text-xs font-medium cursor-pointer ${
                            isSelected ? "fill-accent-foreground" : chordColor ? "fill-white" : "fill-foreground"
                          }`}
                          onClick={() => handleCircleKeyClick(key, true)}
                        >
                          {key}
                        </text>
                      </g>
                    )
                  })}

                  <circle cx="200" cy="200" r="40" className="fill-background stroke-border stroke-2" />
                  <text x="200" y="205" textAnchor="middle" className="text-lg font-bold fill-foreground">
                    {selectedCircleKey || ""}
                  </text>
                </svg>
              </div>
            </div>

            {selectedCircleKey && circleAnalysis && (
              <div className="space-y-4">
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="pt-4">
                    <div className="text-lg font-semibold mb-2">
                      Key: {selectedCircleKey} {getKeyTypeDisplay(selectedCircleKey)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Relative key: {KEY_RELATIONSHIPS[selectedCircleKey as keyof typeof KEY_RELATIONSHIPS]?.relative}.
                      Parallel key: {KEY_RELATIONSHIPS[selectedCircleKey as keyof typeof KEY_RELATIONSHIPS]?.parallel}.
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Chords in {selectedCircleKey} {getKeyTypeDisplay(selectedCircleKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Roman numerals row */}
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {circleAnalysis.map((chord, index) => (
                          <div key={`roman-${index}`} className="text-lg font-bold text-muted-foreground">
                            {chord.roman}
                          </div>
                        ))}
                      </div>

                      {/* Function names row */}
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {circleAnalysis.map((chord, index) => {
                          const functions = isMinorKey(selectedCircleKey)
                            ? CHORD_FUNCTIONS.minor
                            : CHORD_FUNCTIONS.major
                          return (
                            <div key={`function-${index}`} className="text-xs text-muted-foreground px-1">
                              {functions[index]}
                            </div>
                          )
                        })}
                      </div>

                      {/* Chord names row with colors */}
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {circleAnalysis.map((chord, index) => (
                          <div
                            key={`chord-${index}`}
                            className="text-sm font-semibold text-white px-2 py-2 rounded"
                            style={{ backgroundColor: CHORD_COLORS[index] }}
                          >
                            {chord.chord}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!selectedCircleKey && (
              <div className="text-center text-muted-foreground">
                Click on any key in the circle to see its chord progression
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Guitar Fretboard</CardTitle>
            <p className="text-center text-muted-foreground">
              {selectedCircleKey
                ? `Notes highlighted for ${selectedCircleKey} ${getKeyTypeDisplay(selectedCircleKey)}`
                : "All chromatic notes are displayed in gray. Select a key from the Circle of Fifths above to highlight scale notes with chord function colors."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px] bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
                {/* Fret numbers */}
                <div className="flex mb-2">
                  <div className="w-12"></div> {/* Space for string names */}
                  {Array.from({ length: 13 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-xs text-slate-200 font-medium min-w-[50px]">
                      {i === 0 ? "Open" : i}
                    </div>
                  ))}
                </div>

                {/* Fretboard strings */}
                <div className="space-y-1">
                  {GUITAR_STRINGS.map((stringNote, stringIndex) => (
                    <div key={`string-${stringIndex}`} className="flex items-center">
                      {/* String name */}
                      <div className="w-12 text-right pr-2 text-sm font-bold text-slate-200">{stringNote}</div>

                      {/* Frets */}
                      <div className="flex flex-1 relative">
                        {/* String line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-400 transform -translate-y-1/2"></div>

                        {Array.from({ length: 13 }, (_, fret) => {
                          const note = getFretNote(stringNote, fret)
                          const noteColor = getNoteColor(note, selectedCircleKey, circleAnalysis)
                          const showNote = isNoteInScale(note, selectedCircleKey, circleAnalysis)

                          return (
                            <div
                              key={`fret-${fret}`}
                              className="flex-1 flex justify-center items-center min-w-[50px] h-8 relative"
                            >
                              {/* Fret marker (except for open string) */}
                              {fret > 0 && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-500"></div>}

                              {showNote && (
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-lg transform scale-110 transition-all duration-200"
                                  style={{
                                    backgroundColor: selectedCircleKey
                                      ? noteColor || "rgb(107, 114, 128)"
                                      : noteColor || "rgb(107, 114, 128)",
                                  }}
                                >
                                  {note}
                                </div>
                              )}

                              {/* Fret position markers (3rd, 5th, 7th, 9th, 12th frets) */}
                              {stringIndex === 2 && [3, 5, 7, 9, 15, 17, 19, 21].includes(fret) && (
                                <div className="absolute top-10 w-2 h-2 bg-blue-300 rounded-full opacity-60"></div>
                              )}
                              {stringIndex === 2 && fret === 12 && (
                                <div className="absolute top-10 w-3 h-3 bg-blue-200 rounded-full border-2 border-blue-400"></div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fret position markers row */}
                <div className="flex mt-2">
                  <div className="w-12"></div>
                  {Array.from({ length: 13 }, (_, fret) => (
                    <div key={`marker-${fret}`} className="flex-1 flex justify-center min-w-[50px]">
                      {[3, 5, 7, 9, 15, 17, 19, 21].includes(fret) && (
                        <div className="w-2 h-2 bg-blue-300 rounded-full opacity-60"></div>
                      )}
                      {fret === 12 && <div className="w-3 h-3 bg-blue-200 rounded-full border-2 border-blue-400"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedCircleKey && circleAnalysis && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Colors correspond to chord functions:
                <span className="inline-flex items-center gap-2 ml-2">
                  {circleAnalysis.map((chord, index) => (
                    <span key={index} className="inline-flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHORD_COLORS[index] }}></div>
                      <span className="text-xs">{chord.roman}</span>
                    </span>
                  ))}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
