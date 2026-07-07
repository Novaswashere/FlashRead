import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface UploadDropzoneProps {
  onFileDrop: (file: File) => void;
  isProcessing: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileDrop,
  isProcessing,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileDrop(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative w-full h-64 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center bg-surface-container-low cursor-pointer transition-all hover:bg-surface-container-high mb-space-xl",
        dragActive && "border-primary bg-primary-container/10"
      )}
    >
      {isProcessing ? (
        <div className="text-center animate-pulse flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-spin">
            sync
          </span>
          <p className="font-body-lg text-body-lg font-semibold text-primary">
            Processing document...
          </p>
        </div>
      ) : (
        <>
          <span className="material-symbols-outlined text-6xl text-outline mb-4">
            cloud_upload
          </span>
          <p className="font-body-lg text-body-lg font-semibold text-on-surface">
            Drag &amp; drop files here
          </p>
          <p className="text-on-surface-variant text-sm mt-2">
            or tap to browse locally
          </p>
          <input
            accept=".epub,.pdf,.txt"
            className="absolute inset-0 opacity-0 cursor-pointer"
            type="file"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};
