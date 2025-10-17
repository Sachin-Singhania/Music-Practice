"use client"
import { useCallback, useEffect, useRef, useState } from "react"
export function UseMetronome(){
   const [bpm, setBpm] = useState([60])
  const [beatCount, setBeatCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
    const [timeSignature, setTimeSignature] = useState("4/4")
  const [isPlaying, setIsPlaying] = useState(false)
   const [numerator, denominator] = timeSignature.split("/").map(Number)
  const beatsPerMeasure = numerator
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
      const [numerator, denominator] = timeSignature.split("/").map(Number)

      let interval: number
      let beatsPerMeasure: number

      if (denominator === 8 && [6, 9, 12].includes(numerator)) {
        interval = 60000 / (bpm[0] * 2)
        beatsPerMeasure = numerator
      } else if (denominator === 8) {
        interval = 60000 / (bpm[0] * 2)
        beatsPerMeasure = numerator
      } else {
        interval = 60000 / bpm[0]
        beatsPerMeasure = numerator
      }

      const getAccentPattern = (timeSignature: string, beatNumber: number): boolean => {
        return beatNumber === 1
      }

      intervalRef.current = setInterval(() => {
        setBeatCount((prev) => {
          const newCount = (prev % beatsPerMeasure) + 1
          const isAccent = getAccentPattern(timeSignature, newCount)
          playClick(isAccent)
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

  const handleTimeSignatureChange = (newTimeSignature: string) => {
    setTimeSignature(newTimeSignature)
    if (isPlaying) {
      setBeatCount(0)
    }
  }
  return {
    beatsPerMeasure,
    toggleMetronome,
    resetMetronome,
    handleTimeSignatureChange,
    bpm,
    setBpm,
    beatCount,
    isAnimating,
    isPlaying,
    timeSignature,
  }
}