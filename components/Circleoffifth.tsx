"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHORD_COLORS, CHORD_FUNCTIONS, CIRCLE_OF_FIFTHS_MAJOR, CIRCLE_OF_FIFTHS_MINOR, KEY_RELATIONSHIPS } from "@/lib/constants"
import { useContext } from "react"
import { MyContext } from "./Music-provider"
export const CircleOfFifth=() => {
  const context = useContext(MyContext);
  if (!context) return;
  const {circleAnalysis,getKeyTypeDisplay,isMinorKey,selectedCircleKey,clearCircleSelection,getChordColor,handleCircleKeyClick} =  context;
  return (
    <>
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
                    const chordColor = getChordColor( key, selectedCircleKey, circleAnalysis, CHORD_COLORS);

                    return (
                      <g key={`major-${key}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="25"
                          className={`cursor-pointer transition-all duration-200 stroke-2 ${isSelected
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
                          className={`text-sm font-bold cursor-pointer ${isSelected ? "fill-primary-foreground" : chordColor ? "fill-white" : "fill-foreground"
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
                    const chordColor = getChordColor(key , selectedCircleKey, circleAnalysis, CHORD_COLORS);

                    return (
                      <g key={`minor-${key}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="20"
                          className={`cursor-pointer transition-all duration-200 stroke-2 ${isSelected
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
                          className={`text-xs font-medium cursor-pointer ${isSelected ? "fill-accent-foreground" : chordColor ? "fill-white" : "fill-foreground"
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
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {circleAnalysis.map((chord, index) => (
                          <div key={`roman-${index}`} className="text-lg font-bold text-muted-foreground">
                            {chord.roman}
                          </div>
                        ))}
                      </div>

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
    </>
  )
}