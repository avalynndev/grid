import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ActiveIndicatorProps {
  stepId: number;
  activeRef: React.RefObject<HTMLInputElement[]>;
}

export const ActiveIndicator: React.FC<ActiveIndicatorProps> = ({
  stepId,
  activeRef,
}) => {
  return (
    <Label className="flex justify-center">
      <Input
        type="radio"
        name="active"
        id={`active-${stepId}`}
        disabled
        ref={(elm) => {
          if (elm) activeRef.current[stepId] = elm;
        }}
        className="absolute w-0 h-0 -m-px p-0 overflow-hidden whitespace-nowrap border-0 clip-rect-0"
      />
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded-full transition-all [input:checked+&]:bg-primary [input:checked+&]:scale-125"></div>
    </Label>
  );
};
