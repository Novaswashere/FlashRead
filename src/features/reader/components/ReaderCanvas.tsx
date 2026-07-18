import React from "react";
import { cn } from "@/lib/utils";

export interface ReaderCanvasProps {
  children: React.ReactNode;
  onCanvasClick?: () => void;
  orpEnabled?: boolean;
  className?: string;
}

export const ReaderCanvas: React.FC<ReaderCanvasProps> = ({
  children,
  onCanvasClick,
  orpEnabled = true,
  className,
}) => {
  return (
    <div
      onClick={onCanvasClick}
      className={cn(
        "max-w-reader-width w-full h-96 flex items-center justify-center relative cursor-pointer overflow-hidden",
        className
      )}
    >
      {/* Center guide hairline - ORP alignment point */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-full h-px bg-border-subtle opacity-20"></div>
        {orpEnabled && (
          <div className="absolute w-0.5 h-12 bg-primary/30 rounded-full"></div>
        )}
      </div>
      {children}
    </div>
  );
};
