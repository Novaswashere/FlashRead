import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelMin?: string;
  labelMax?: string;
}

export const Slider: React.FC<SliderProps> = ({
  className,
  labelMin,
  labelMax,
  ...props
}) => {
  const minVal = props.min ? Number(props.min) : 0;
  const maxVal = props.max ? Number(props.max) : 100;
  const currentVal = props.value ? Number(props.value) : 0;
  const percent = maxVal > minVal ? ((currentVal - minVal) / (maxVal - minVal)) * 100 : 0;

  return (
    <div className="flex flex-col w-full">
      {(labelMin || labelMax) && (
        <div className="flex justify-between mb-2">
          {labelMin && (
            <span className="font-label-mono text-label-mono text-on-surface-variant">
              {labelMin}
            </span>
          )}
          {labelMax && (
            <span className="font-label-mono text-label-mono text-on-surface-variant">
              {labelMax}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        style={{
          background: `linear-gradient(to right, var(--primary) ${percent}%, var(--border-subtle) ${percent}%)`,
        }}
        className={cn(
          "w-full h-1 appearance-none cursor-pointer rounded-lg",
          className
        )}
        {...props}
      />
    </div>
  );
};
