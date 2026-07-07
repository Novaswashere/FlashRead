import { ParsedBook } from "../../types";

export interface ParseOptions {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
  metadata?: Record<string, any>;
}

export interface IDocumentParser {
  parse(data: File | string, options?: ParseOptions): Promise<ParsedBook>;
}
