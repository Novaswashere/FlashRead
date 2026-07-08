import { ParsedBook, Chapter, ParagraphBlock } from "../../types";
import { IDocumentParser, ParseOptions } from "./contract";
import {
  ParserError,
  EncryptedPdfError,
  EmptyDocumentError,
  CorruptedFileError,
} from "../../lib/errors";
import type { PDFDocumentProxy } from "pdfjs-dist";

export class PdfParser implements IDocumentParser {
  async parse(
    data: File | string,
    options?: ParseOptions
  ): Promise<ParsedBook> {
    const signal = options?.signal;
    const onProgress = options?.onProgress;

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    if (typeof data === "string") {
      throw new ParserError(
        "PDF parser expects a binary File, not a string",
        "INVALID_INPUT"
      );
    }

    onProgress?.(5);

    // Dynamic import to bypass Next.js SSR prerendering environment errors
    const pdfjs = await import("pdfjs-dist");

    if (typeof window !== "undefined") {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }

    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await data.arrayBuffer();
    } catch (err: any) {
      throw new CorruptedFileError(
        `Failed to read PDF file binary data: ${err?.message || err}`
      );
    }

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    onProgress?.(15);

    let pdfDoc: PDFDocumentProxy;
    try {
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
      });

      if (signal) {
        signal.addEventListener("abort", () => {
          loadingTask.destroy();
        });
      }

      pdfDoc = await loadingTask.promise;
    } catch (err: any) {
      if (err?.name === "PasswordException") {
        throw new EncryptedPdfError(
          "This PDF document is encrypted or password protected"
        );
      }
      throw new CorruptedFileError(
        `Failed to load PDF document: ${err?.message || err}`
      );
    }

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    const totalPages = pdfDoc.numPages;
    if (totalPages === 0) {
      throw new EmptyDocumentError("The PDF document contains no pages");
    }

    onProgress?.(25);

    const blocks: ParagraphBlock[] = [];
    let wordCount = 0;

    // Iterate through pages
    for (let i = 1; i <= totalPages; i++) {
      if (signal?.aborted) {
        throw new ParserError("Parsing aborted", "ABORTED");
      }

      const progressPercent = 30 + Math.round((i / totalPages) * 60);
      onProgress?.(progressPercent);

      try {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();

        // Filter text items
        const textItems = textContent.items.filter(
          (item: any) => typeof item.str === "string"
        );
        if (textItems.length === 0) continue;

        // Sort items vertically (y coordinate descending) and horizontally (x coordinate ascending)
        const sortedItems = (textItems as any[]).sort((a, b) => {
          if (Math.abs(a.transform[5] - b.transform[5]) < 3) {
            return a.transform[4] - b.transform[4];
          }
          return b.transform[5] - a.transform[5];
        });

        // Group into lines
        let lastY = -1;
        const pageLines: string[] = [];
        let currentLine = "";

        for (const item of sortedItems) {
          const str = item.str;
          const y = item.transform[5];

          if (lastY === -1) {
            currentLine = str;
          } else if (Math.abs(y - lastY) < 3) {
            // Same line
            currentLine += str;
          } else {
            // New line
            pageLines.push(currentLine);
            currentLine = str;
          }
          lastY = y;
        }
        if (currentLine) {
          pageLines.push(currentLine);
        }

        // Clean lines (remove header, footer, page number patterns)
        const cleanedLines = pageLines
          .map((line) => line.trim())
          .filter((line) => {
            if (!line) return false;
            if (/^\d+$/.test(line)) return false;
            if (/^page\s+\d+/i.test(line)) return false;
            if (/^\d+\s+of\s+\d+$/i.test(line)) return false;
            return true;
          });

        // Heuristic: Group lines into paragraphs based on punctuation ends
        let currentParagraph = "";
        for (const line of cleanedLines) {
          if (currentParagraph === "") {
            currentParagraph = line;
          } else {
            currentParagraph += " " + line;
          }

          if (line.endsWith(".") || line.endsWith("?") || line.endsWith("!")) {
            const pId = `para-${Math.random().toString(36).substring(2, 9)}`;
            blocks.push({
              id: pId,
              type: "paragraph",
              text: currentParagraph,
            });
            wordCount += currentParagraph.split(/\s+/).filter(Boolean).length;
            currentParagraph = "";
          }
        }

        if (currentParagraph) {
          const pId = `para-${Math.random().toString(36).substring(2, 9)}`;
          blocks.push({
            id: pId,
            type: "paragraph",
            text: currentParagraph,
          });
          wordCount += currentParagraph.split(/\s+/).filter(Boolean).length;
        }
      } catch (pageErr) {
        console.error(`Error parsing page ${i}:`, pageErr);
      }
    }

    if (blocks.length === 0) {
      throw new EmptyDocumentError(
        "The PDF document contains no readable text content (it may be a scanned PDF image)"
      );
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
      bookId,
      chapters,
      totalWords: wordCount,
      metadata: {
        title: data.name.replace(/\.[^/.]+$/, ""),
        fileName: data.name,
        fileSize: data.size,
        contentType: "pdf",
      },
    };
  }
}
export default PdfParser;
