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
        "max-w-reader-width w-full h-96 flex flex-col items-center justify-center relative cursor-pointer",
        className
      )}
    >
      {/* Focus Crosshairs Guides */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-full h-px bg-border-subtle opacity-30"></div>
        {orpEnabled && (
          <div className="orp-marker absolute h-full flex items-center justify-center"></div>
        )}
      </div>
      {children}
    </div>
  );
};
