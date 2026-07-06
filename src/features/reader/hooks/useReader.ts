"use client";

import { useReaderContext } from "../../../providers/ReaderProvider";

export function useReader() {
  const context = useReaderContext();
  return {
    ...context,
  };
}
