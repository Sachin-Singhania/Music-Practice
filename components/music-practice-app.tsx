"use client"

import { Music } from "lucide-react"
import { CircleAndFretBoard } from "./CircleAndFreboard"
import { Metronome } from "./Metronome"
import { ScaleGenerator } from "./ScaleGenerator"


export function MusicPracticeApp() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-balance">Music Practice Studio</h1>
          </div>
          <p className="text-muted-foreground text-lg">Perfect your timing and explore musical scales</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Metronome />
          <ScaleGenerator />        
        </div>
       <CircleAndFretBoard />
      </div>
    </div>
  )
}


