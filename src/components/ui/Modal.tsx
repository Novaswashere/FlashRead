import React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/10 backdrop-blur-sm z-[60] flex items-center justify-center transition-opacity duration-200">
      <div className="bg-surface-container-lowest p-space-xl rounded-xl border border-border-subtle shadow-xl w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 material-symbols-outlined text-on-surface-variant hover:text-on-surface text-xl cursor-pointer"
        >
          close
        </button>
        <h3 className="font-headline-md text-center mb-space-lg">{title}</h3>
        {children}
      </div>
    </div>
  );
};
