import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sample } from "@/types";

interface SoundPickerProps {
  samples: Sample[];
  selectedSamples: string[];
  setSelectedSamples: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SoundPicker: React.FC<SoundPickerProps> = ({
  samples,
  selectedSamples,
  setSelectedSamples,
}) => {
  return (
    <div className="grid gap-2 sm:gap-3">
      <div className="h-10 sm:h-14 flex items-center justify-center border-b-2 border-border">
        <span className="text-xs sm:text-sm font-bold text-muted-foreground tracking-wide">
          SOUNDS
        </span>
      </div>
      {selectedSamples.map((selectedSample, trackId) => (
        <div
          key={trackId}
          className="h-10 sm:h-14 flex items-center justify-center"
        >
          <Select
            value={selectedSample}
            onValueChange={(value) => {
              const updatedSamples = [...selectedSamples];
              updatedSamples[trackId] = value;
              setSelectedSamples(updatedSamples);
            }}
          >
            <SelectTrigger className="w-24 sm:w-32 h-8 sm:h-10 font-medium text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {samples.map((sample) => (
                <SelectItem key={sample.name} value={sample.name}>
                  {sample.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
