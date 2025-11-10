import * as Tone from "tone";

export interface Sample {
  url: string;
  name: string;
}

export interface Track {
  id: number;
  key: string;
  sampler: Tone.Sampler;
}
