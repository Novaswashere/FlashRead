import { SUPPORTED_FILE_TYPES } from "../constants";

export function validateFileType(fileName: string): boolean {
  const extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
  return SUPPORTED_FILE_TYPES.includes(extension as any);
}

export function validateMaxPasteLength(text: string, limit = 100000): boolean {
  return text.length <= limit;
}
