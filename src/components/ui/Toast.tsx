import React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  type?: "info" | "success" | "error";
  isVisible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 right-6 md:right-10 z-[70] flex items-center justify-between gap-space-md p-space-md rounded-xl border shadow-lg max-w-sm transition-transform duration-300",
        type === "info" &&
          "bg-surface-container border-border-subtle text-on-surface",
        type === "success" &&
          "bg-secondary-container border-primary/20 text-on-secondary-container",
        type === "error" &&
          "bg-error-container border-error/20 text-on-error-container"
      )}
    >
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="material-symbols-outlined text-sm hover:opacity-80 cursor-pointer"
        >
          close
        </button>
      )}
    </div>
  );
};
