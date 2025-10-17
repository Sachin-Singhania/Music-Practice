"use client"
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { TIME_SIGNATURES } from "@/lib/constants";
import { Button } from "./ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";
import { UseMetronome } from "@/hooks/metronome.hook";

export function Metronome() {
  const {beatsPerMeasure,toggleMetronome,resetMetronome,handleTimeSignatureChange,bpm,setBpm,beatCount,isAnimating,isPlaying,timeSignature} = UseMetronome();
  return (
    <>
  <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Metronome</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center text-2xl font-bold transition-all duration-100 ${isAnimating ? "metronome-tick bg-primary/20" : "bg-card"
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
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-100 ${isPlaying && beatCount === i + 1
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
                <Select value={timeSignature} onValueChange={handleTimeSignatureChange}>
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
    </>
  )
}