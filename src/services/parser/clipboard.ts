import { ParsedBook, Chapter, ParagraphBlock } from "../../types";
import { IDocumentParser, ParseOptions } from "./contract";
import { ParserError, EmptyDocumentError } from "../../lib/errors";

export class ClipboardParser implements IDocumentParser {
  async parse(
    data: File | string,
    options?: ParseOptions
  ): Promise<ParsedBook> {
    const signal = options?.signal;
    const onProgress = options?.onProgress;

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    onProgress?.(10);

    const text = typeof data === "string" ? data : "";
    if (!text.trim()) {
      throw new EmptyDocumentError("Pasted clipboard text is empty");
    }

    onProgress?.(40);

    const normalizedText = text.replace(/\r\n/g, "\n");
    const paragraphTexts = normalizedText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (paragraphTexts.length === 0) {
      throw new EmptyDocumentError(
        "Pasted clipboard text contains no valid paragraphs"
      );
    }

    onProgress?.(70);

    const blocks: ParagraphBlock[] = [];
    let wordCount = 0;
    const totalParas = paragraphTexts.length;

    for (let i = 0; i < totalParas; i++) {
      if (signal?.aborted) {
        throw new ParserError("Parsing aborted", "ABORTED");
      }

      const pText = paragraphTexts[i];
      const pId = `para-${Math.random().toString(36).substring(2, 9)}`;

      blocks.push({
        id: pId,
        type: "paragraph",
        text: pText,
      });

      wordCount += pText.split(/\s+/).filter(Boolean).length;
    }

    const chapterId = `chap-${Math.random().toString(36).substring(2, 9)}`;
    const flatContent = blocks.map((b) => b.text).join("\n\n");

    const chapters: Chapter[] = [
      {
        id: chapterId,
        title: options?.metadata?.title || "Pasted Content",
        blocks: blocks,
        content: flatContent,
        wordCount: wordCount,
      },
    ];

    onProgress?.(100);

    const bookId = `book-${Math.random().toString(36).substring(2, 9)}`;

    return {
      id: bookId,
      bookId: bookId,
      chapters,
      totalWords: wordCount,
      metadata: {
        title: options?.metadata?.title || "Pasted Content",
        contentType: "clipboard",
      },
    };
  }
}
export default ClipboardParser;
