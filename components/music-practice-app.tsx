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
  "Blues Scale",
  "Melodic Minor",
  "Harmonic Minor",
  "Hungarian Scale",
]

const TIME_SIGNATURES = ["1/4", "2/4", "3/4", "4/4"]

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

  const beatsPerMeasure = Number.parseInt(timeSignature.split("/")[0])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
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
      </div>
    </div>
  )
}
