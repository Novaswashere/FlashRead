import { ParsedBook } from "../../types";
import { IDocumentParser, ParseOptions } from "./contract";
import { EpubParser } from "./epub";
import { PdfParser } from "./pdf";
import { TxtParser } from "./txt";
import { ClipboardParser } from "./clipboard";
import { UnsupportedFormatError } from "../../lib/errors";

export class ParserRegistry {
  private parsers: Map<string, IDocumentParser> = new Map();

  register(key: string, parser: IDocumentParser): void {
    this.parsers.set(key.toLowerCase(), parser);
  }

  getParser(filename: string, mimeType?: string): IDocumentParser {
    if (mimeType) {
      const parser = this.parsers.get(mimeType.toLowerCase());
      if (parser) return parser;
    }
    const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
    const parser = this.parsers.get(ext);
    if (!parser) {
      throw new UnsupportedFormatError(
        `No parser registered for file: ${filename}`
      );
    }
    return parser;
  }
}

export const parserRegistry = new ParserRegistry();

// Instantiate parsers
const epubParser = new EpubParser();
const pdfParser = new PdfParser();
const txtParser = new TxtParser();
const clipboardParser = new ClipboardParser();

// Register them
parserRegistry.register(".epub", epubParser);
parserRegistry.register("application/epub+zip", epubParser);

parserRegistry.register(".pdf", pdfParser);
parserRegistry.register("application/pdf", pdfParser);

parserRegistry.register(".txt", txtParser);
parserRegistry.register("text/plain", txtParser);

export class ParserService {
  async parse(
    data: File | string,
    title?: string,
    options?: ParseOptions
  ): Promise<ParsedBook> {
    if (typeof data === "string") {
      // For clipboard content, we pass the title via options or default to a string
      const clipOptions = {
        ...options,
        metadata: {
          title: title || "Pasted Content",
          ...(options?.metadata || {}),
        },
      };
      return clipboardParser.parse(data, clipOptions);
    }

    const parser = parserRegistry.getParser(data.name, data.type);
    return parser.parse(data, options);
  }
}

export const parserService = new ParserService();
export { EpubParser, PdfParser, TxtParser, ClipboardParser };
export * from "./contract";
