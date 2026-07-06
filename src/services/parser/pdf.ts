import { ParsedBook } from "../../types";
import { IDocumentParser } from "./index";

export class PdfParser implements IDocumentParser {
  async parse(file: File): Promise<ParsedBook> {
    // Stub implementation to be filled in later phases
    return {
      id: Math.random().toString(36).substring(7),
      bookId: Math.random().toString(36).substring(7),
      chapters: [],
      totalWords: 0,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        contentType: "pdf",
      },
    };
  }
}
