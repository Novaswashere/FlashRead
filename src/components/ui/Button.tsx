import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-space-sm font-semibold rounded-lg h-12 px-space-lg transition-all active:scale-95",
        variant === "primary" &&
          "bg-primary text-on-primary hover:brightness-110",
        variant === "secondary" &&
          "bg-surface-container-high text-on-surface border border-border-subtle hover:bg-surface-container-low",
        variant === "text" &&
          "text-primary hover:underline bg-transparent px-2 h-auto",
        variant === "danger" && "bg-error text-on-error hover:brightness-110",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
