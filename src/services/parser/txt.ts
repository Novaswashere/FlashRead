import { ParsedBook, Chapter, ParagraphBlock } from "../../types";
import { IDocumentParser, ParseOptions } from "./contract";
import { ParserError, EmptyDocumentError } from "../../lib/errors";

export class TxtParser implements IDocumentParser {
  async parse(data: File | string, options?: ParseOptions): Promise<ParsedBook> {
    const signal = options?.signal;
    const onProgress = options?.onProgress;

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    onProgress?.(10); // Initialized

    let textContent = "";
    let fileName = "Pasted Content";
    let fileSize = 0;

    if (typeof data === "string") {
      textContent = data;
    } else {
      fileName = data.name;
      fileSize = data.size;
      onProgress?.(30); // Reading
      textContent = await this.readFileAsText(data, signal);
    }

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    onProgress?.(50); // Splitting layout

    // Normalize newlines and split by paragraph
    const normalizedText = textContent.replace(/\r\n/g, "\n");
    const paragraphTexts = normalizedText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (paragraphTexts.length === 0) {
      throw new EmptyDocumentError("The TXT document contains no text content");
    }

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

      if (i % 50 === 0 || i === totalParas - 1) {
        const percent = 50 + Math.round((i / totalParas) * 40);
        onProgress?.(percent);
      }
    }

    const chapterId = `chap-${Math.random().toString(36).substring(2, 9)}`;
    const flatContent = blocks.map((b) => b.text).join("\n\n");

    const chapters: Chapter[] = [
      {
        id: chapterId,
        title: "Chapter 1",
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
        title: fileName.replace(/\.[^/.]+$/, ""),
        fileName,
        fileSize,
        contentType: "txt",
      },
    };
  }

  private readFileAsText(file: File, signal?: AbortSignal): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);

      if (signal) {
        signal.addEventListener("abort", () => {
          reader.abort();
          reject(new ParserError("Parsing aborted", "ABORTED"));
        });
      }

      reader.readAsText(file, "utf-8");
    });
  }
}
export default TxtParser;
