"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import { ThemeToggle } from "@/components/theme-toggle";
import { ActiveIndicator } from "@/components/active-indicator";
import { Controls } from "@/components/controls";
import { samples } from "@/constants/samples";
import { SoundPicker } from "@/components/sound-picker";
import { Track } from "@/types";

const NOTE = "C2";

export default function Home() {
  const [measures, setMeasures] = useState<number>(4);
  const [beats, setBeats] = useState<number>(4);
  const [selectedSamples, setSelectedSamples] = useState<string[]>([
    samples[0].name,
    samples[1].name,
    samples[2].name,
    samples[3].name,
  ]);

  const tracksRef = useRef<Track[]>([]);
  const stepsRef = useRef<HTMLInputElement[][]>([]);
  const activeRef = useRef<HTMLInputElement[]>([]);
  const seqRef = useRef<Tone.Sequence | null>(null);

  const stepIds = [...Array(beats * measures).keys()];

  useEffect(() => {
    tracksRef.current = selectedSamples.map((selectedSample, i) => ({
      id: i,
      key: "track" + i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: samples.find((sample) => sample.name === selectedSample)!.url,
        },
      }).toDestination(),
    }));

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.forEach((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
          if (activeRef.current[step]) {
            activeRef.current[step].checked = true;
          }
        });
      },
      stepIds,
      "16n",
    );
    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.forEach((trk) => trk.sampler.dispose());
    };
  }, [selectedSamples, beats * measures]);

  const [measuresPerRow, setMeasuresPerRow] = useState(4);

  useEffect(() => {
    const updateMeasuresPerRow = () => {
      if (window.innerWidth < 640) {
        setMeasuresPerRow(1);
      } else if (window.innerWidth < 1024) {
        setMeasuresPerRow(2);
      } else {
        setMeasuresPerRow(4);
      }
    };

    updateMeasuresPerRow();
    window.addEventListener("resize", updateMeasuresPerRow);
    return () => window.removeEventListener("resize", updateMeasuresPerRow);
  }, []);

  const measureRows = Math.ceil(measures / measuresPerRow);

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
      <Controls
        setSelectedSamples={setSelectedSamples}
        setMeasures={setMeasures}
        selectedSamples={selectedSamples}
        setBeats={setBeats}
        measures={measures}
      />
      <div className="absolute top-2 right-4 z-40">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-76 sm:pt-64 md:pt-52 xl:pt-48">
        {Array.from({ length: measureRows }, (_, rowIndex) => {
          const startMeasure = rowIndex * measuresPerRow;
          const endMeasure = Math.min(startMeasure + measuresPerRow, measures);
          const measuresInThisRow = endMeasure - startMeasure;

          return (
            <div key={rowIndex} className="mb-4 sm:mb-8">
              <div
                className="grid gap-3 sm:gap-6"
                style={{
                  gridTemplateColumns: rowIndex === 0 ? "auto 1fr" : "1fr",
                }}
              >
                {rowIndex === 0 && (
                  <SoundPicker
                    samples={samples}
                    selectedSamples={selectedSamples}
                    setSelectedSamples={setSelectedSamples}
                  />
                )}

                <div
                  className="grid gap-3 sm:gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${measuresInThisRow}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: measuresInThisRow }, (_, i) => {
                    const measureIndex = startMeasure + i;
                    return (
                      <Card
                        key={measureIndex}
                        className="p-2 sm:p-4 bg-card/50 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-shadow"
                      >
                        <div className="grid gap-2 sm:gap-3">
                          <div className="flex items-center justify-between mb-1 sm:mb-2 pb-1 sm:pb-2 border-b-2 border-border">
                            <span className="text-xs font-bold text-muted-foreground tracking-wider">
                              M{measureIndex + 1}
                            </span>
                            <div
                              className="grid gap-0.5 sm:gap-1"
                              style={{
                                gridTemplateColumns: `repeat(${beats}, minmax(0, 1fr))`,
                              }}
                            >
                              {Array.from({ length: beats }, (_, beatIndex) => (
                                <ActiveIndicator
                                  key={beatIndex}
                                  stepId={beatIndex + measureIndex * beats}
                                  activeRef={activeRef}
                                />
                              ))}
                            </div>
                          </div>

                          {selectedSamples.map((selectedSample, trackId) => (
                            <div
                              key={trackId}
                              className="grid gap-1 sm:gap-1.5"
                              style={{
                                gridTemplateColumns: `repeat(${beats}, minmax(0, 1fr))`,
                              }}
                            >
                              {Array.from({ length: beats }, (_, beatIndex) => {
                                const stepId = beatIndex + measureIndex * beats;
                                const id = `${trackId}-${stepId}`;
                                return (
                                  <Label
                                    key={id}
                                    className="cursor-pointer flex justify-center"
                                  >
                                    <Input
                                      id={id}
                                      type="checkbox"
                                      ref={(elm) => {
                                        if (!elm) return;
                                        if (!stepsRef.current[trackId]) {
                                          stepsRef.current[trackId] = [];
                                        }
                                        stepsRef.current[trackId][stepId] = elm;
                                      }}
                                      className="absolute w-0 h-0 -m-px p-0 overflow-hidden whitespace-nowrap border-0 clip-rect-0"
                                    />
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background border-2 border-input rounded-lg transition-all hover:border-primary/50 active:scale-95 [input:checked+&]:bg-primary [input:checked+&]:border-primary [input:checked+&]:shadow-lg [input:focus-visible+&]:outline-2 [input:focus-visible+&]:outline-ring [input:focus-visible+&]:outline-offset-2"></div>
                                  </Label>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
