"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ALL_MODES, KEYS } from "@/lib/constants"
import { getEnharmonicScaleNotes, getScaleNotes, isAccidentalKey } from "@/lib/utils"
import { RotateCcw, Settings } from "lucide-react"
import { useState } from "react"
import { UseGenerateRandomKeyAndMode } from "../hooks/music.hook"
export function ScaleGenerator() {
    const {countofCombinations,currentKey,currentMode,generateRandomKeyAndMode2,selectedModes,toggleAllModes,toggleModeSelection} = UseGenerateRandomKeyAndMode();
  const [showSettings, setShowSettings] = useState(false)
  
  const formatKeyDisplay = (key: (typeof KEYS)[0]) => {
    return key.enharmonic ? `${key.name}/${key.enharmonic}` : key.name
  }
  return (
    <>
  <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                Key & Scale Generator
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
                  <div className="text-sm text-muted-foreground">Scale</div>
                  <div className="text-2xl font-semibold text-accent">{currentMode}</div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">Notes in Scale</div>

                  {isAccidentalKey(currentKey.name) ? (
                    <div className="space-y-3">
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

              <Button onClick={generateRandomKeyAndMode2} size="lg" className="w-full bg-transparent" variant="outline">
                <RotateCcw className="h-5 w-5 mr-2" />
                Generate New Key & Scale ({countofCombinations})
              </Button>

              {showSettings && (
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Scale Selection
                      <Button variant="ghost" size="sm" onClick={toggleAllModes} className="text-xs">
                        {selectedModes.length === ALL_MODES.length ? "Deselect All" : "Select All"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground mb-3">
                      Selected: {selectedModes.length} of {ALL_MODES.length} scales
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
                  Practice scales, arpeggios, or improvisation in{" "}
                  <span className="font-medium text-foreground">
                    {formatKeyDisplay(currentKey)} {currentMode}
                  </span>
                  {" at your current tempo."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Active Scales ({selectedModes.length}):</h4>
                <div className="flex flex-wrap gap-1 text-xs">
                  {selectedModes.map((mode) => (
                    <div
                      key={mode}
                      className={`px-2 py-1 rounded transition-colors ${mode === currentMode
                          ? "bg-primary/20 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground bg-muted/30"
                        }`}
                    >
                      {mode}
                    </div>
                  ))}
                  {selectedModes.length === 0 && (
                    <div className="p-2 text-muted-foreground text-center w-full">
                      No scales selected. Click the settings icon to choose scales.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
    </>
  )
}