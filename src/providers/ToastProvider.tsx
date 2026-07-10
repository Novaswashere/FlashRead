"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: "info" | "success" | "error", duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: "info" | "success" | "error" = "info", duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, message, type, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast List Container */}
      <div 
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "w-full flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-auto animate-in slide-in-from-right-5 fade-in",
              toast.type === "info" && "bg-surface-container-low/95 border-border-subtle text-on-surface",
              toast.type === "success" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
              toast.type === "error" && "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-cyan-500" />}
            </div>
            
            <span className="flex-1 text-sm font-medium text-left leading-relaxed">
              {toast.message}
            </span>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 text-outline hover:text-on-surface transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
