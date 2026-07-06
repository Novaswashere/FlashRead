import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className
}) => {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "w-full h-1 bg-surface-container rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
