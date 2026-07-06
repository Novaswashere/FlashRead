import { ParsedBook } from "../../types";

export class ClipboardParser {
  async parse(text: string, title?: string): Promise<ParsedBook> {
    // Stub implementation to be filled in later phases
    return {
      id: Math.random().toString(36).substring(7),
      bookId: Math.random().toString(36).substring(7),
      chapters: [
        {
          title: title || "Pasted Content",
          content: text,
          wordCount: text.split(/\s+/).filter(Boolean).length,
        },
      ],
      totalWords: text.split(/\s+/).filter(Boolean).length,
      metadata: {
        contentType: "clipboard",
      },
    };
  }
}
