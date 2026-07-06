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
  return (
    <div className="flex flex-col w-full">
      {(labelMin || labelMax) && (
        <div className="flex justify-between mb-2">
          {labelMin && <span className="font-label-mono text-label-mono text-on-surface-variant">{labelMin}</span>}
          {labelMax && <span className="font-label-mono text-label-mono text-on-surface-variant">{labelMax}</span>}
        </div>
      )}
      <input
        type="range"
        className={cn(
          "w-full h-1 appearance-none bg-transparent cursor-pointer",
          className
        )}
        {...props}
      />
    </div>
  );
};
