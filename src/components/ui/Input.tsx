import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-surface-container-lowest border border-border-subtle rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md placeholder:text-outline",
          className
        )}
        {...props}
      />
    </div>
  );
};
