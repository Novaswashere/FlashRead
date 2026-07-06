import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  icon?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  className,
  label,
  description,
  icon,
  id,
  ...props
}) => {
  return (
    <label className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group rounded-xl">
      <div className="flex items-center gap-space-md">
        {icon && <span className="material-symbols-outlined text-secondary">{icon}</span>}
        <div>
          {label && <p className="font-medium text-on-surface">{label}</p>}
          {description && <p className="text-xs text-on-surface-variant">{description}</p>}
        </div>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="sr-only ios-toggle"
          {...props}
        />
        <div className="w-11 h-6 bg-surface-container-highest rounded-full transition-colors toggle-bg"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform toggle-dot"></div>
      </div>
    </label>
  );
};
