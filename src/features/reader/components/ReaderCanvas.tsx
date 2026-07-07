import React from "react";

export interface ReaderCanvasProps {
  children: React.ReactNode;
  onCanvasClick?: () => void;
}

export const ReaderCanvas: React.FC<ReaderCanvasProps> = ({
  children,
  onCanvasClick,
}) => {
  return (
    <div
      onClick={onCanvasClick}
      className="max-w-reader-width w-full h-96 flex flex-col items-center justify-center relative cursor-pointer"
    >
      {/* Focus Crosshairs Guides */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-full h-px bg-border-subtle opacity-30"></div>
        <div className="orp-marker absolute h-full flex items-center justify-center"></div>
      </div>
      {children}
    </div>
  );
};
