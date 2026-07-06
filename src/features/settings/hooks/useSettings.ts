"use client";

import { useSettingsContext } from "../../../providers/SettingsProvider";

export function useSettings() {
  const context = useSettingsContext();
  return {
    ...context,
  };
}
