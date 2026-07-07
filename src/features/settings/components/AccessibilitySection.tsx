import React from "react";
import { Switch } from "@/components/ui/Switch";

export interface AccessibilitySectionProps {
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  onReducedMotionChange: (enabled: boolean) => void;
  onScreenReaderChange: (enabled: boolean) => void;
}

export const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  reducedMotion,
  screenReaderOptimized,
  onReducedMotionChange,
  onScreenReaderChange,
}) => {
  return (
    <div className="flex flex-col">
      <Switch
        icon="motion_photos_off"
        label="Reduce Motion"
        description="Disable speed transitions and layout animations"
        checked={reducedMotion}
        onChange={(e) => onReducedMotionChange(e.target.checked)}
      />
      <Switch
        icon="accessibility_new"
        label="Screen Reader Optimized"
        description="Optimize visual components for keyboard narration tools"
        checked={screenReaderOptimized}
        onChange={(e) => onScreenReaderChange(e.target.checked)}
      />
    </div>
  );
};
