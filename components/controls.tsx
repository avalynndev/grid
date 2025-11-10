"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";
import * as Tone from "tone";

interface ControlsProps {
  setSelectedSamples: React.Dispatch<React.SetStateAction<string[]>>;
  setMeasures: React.Dispatch<React.SetStateAction<number>>;
  setBeats: React.Dispatch<React.SetStateAction<number>>;
  measures: number;
}

export const Controls: React.FC<ControlsProps> = ({
  setSelectedSamples,
  setMeasures,
  setBeats,
  measures,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(1);

  const handleStartStop = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (value: number[]) => {
    setBpm(value[0]);
    Tone.Transport.bpm.value = value[0];
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    Tone.Destination.volume.value = Tone.gainToDb(value[0]);
  };

  return (
    <div className="fixed z-20 w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-x-8 sm:gap-y-4">
          <Button
            onClick={handleStartStop}
            className="w-full sm:w-28 h-11 text-base font-semibold"
            size="lg"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </Button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <Label className="min-w-[3rem] font-medium text-sm">BPM</Label>
            <Slider
              min={30}
              max={300}
              step={1}
              value={[bpm]}
              onValueChange={handleBpmChange}
              className="flex-1 sm:w-32"
            />
            <span className="text-sm font-mono font-semibold min-w-[3rem] text-right">
              {bpm}
            </span>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <Label className="min-w-[4rem] font-medium text-sm">Volume</Label>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={handleVolumeChange}
              className="flex-1 sm:w-32"
            />
            <span className="text-sm font-mono font-semibold min-w-[3rem] text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-border"></div>

          <div className="flex items-center gap-2">
            <Label htmlFor="beats" className="font-medium text-sm">
              Beats
            </Label>
            <Select
              defaultValue="4"
              onValueChange={(value) => setBeats(Number(value))}
            >
              <SelectTrigger className="w-20" id="beats">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              className="flex-1 sm:flex-initial sm:w-32 font-medium text-sm"
              onClick={() => setMeasures((prev) => prev + 1)}
            >
              + Add
            </Button>

            <Button
              variant="secondary"
              className="flex-1 sm:flex-initial sm:w-32 font-medium text-sm"
              onClick={() => setMeasures((prev) => Math.max(prev - 1, 2))}
              disabled={measures <= 2}
            >
              - Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
