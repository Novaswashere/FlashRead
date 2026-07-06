import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-space-xl border-2 border-dashed border-border-subtle rounded-2xl bg-surface-container-low text-center group cursor-pointer hover:border-primary transition-colors",
        className
      )}
      onClick={onAction}
    >
      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl mb-2">
        {icon}
      </span>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h3>
      <p className="text-on-surface-variant max-w-xs mx-auto text-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className="bg-primary text-on-primary font-semibold px-space-lg h-10 rounded-lg active:scale-95 transition-all text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
