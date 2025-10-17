"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CHORD_COLORS, GUITAR_STRINGS } from "@/lib/constants"
import { getFretNote, getNoteColor, isNoteInScale } from "@/lib/utils"
import { useContext } from "react"
import { MyContext } from "./Music-provider"
export const GuitarFretboard=() => {
    const context = useContext(MyContext);
    if (!context) return;
    const {selectedCircleKey,circleAnalysis,getKeyTypeDisplay} = context;
  return (
    <>
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
                <div className="flex mb-2">
                  <div className="w-12"></div>
                  {Array.from({ length: 13 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-xs text-slate-200 font-medium min-w-[50px]">
                      {i === 0 ? "Open" : i}
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  {GUITAR_STRINGS.map((stringNote, stringIndex) => (
                    <div key={`string-${stringIndex}`} className="flex items-center">
                      <div className="w-12 text-right pr-2 text-sm font-bold text-slate-200">{stringNote}</div>

                      <div className="flex flex-1 relative">
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
                  {circleAnalysis.map((chord:any, index:any) => (
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
    </>
  )
}