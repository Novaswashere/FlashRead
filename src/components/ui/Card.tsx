import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = true,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest border border-border-subtle rounded-xl p-space-lg transition-all",
        hoverable && "hover:border-primary/20 hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
