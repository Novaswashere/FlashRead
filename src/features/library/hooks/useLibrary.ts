"use client";

import { useLibraryContext } from "../../../providers/LibraryProvider";

export function useLibrary() {
  const context = useLibraryContext();
  return {
    ...context,
  };
}
