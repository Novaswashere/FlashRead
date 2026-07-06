import { ParsedBook } from "../../types";
import { EpubParser } from "./epub";
import { PdfParser } from "./pdf";
import { TxtParser } from "./txt";
import { ClipboardParser } from "./clipboard";

export interface IDocumentParser {
  parse(data: File | string, title?: string): Promise<ParsedBook>;
}

export class ParserService implements IDocumentParser {
  private epubParser = new EpubParser();
  private pdfParser = new PdfParser();
  private txtParser = new TxtParser();
  private clipboardParser = new ClipboardParser();

  async parse(data: File | string, title?: string): Promise<ParsedBook> {
    if (typeof data === "string") {
      return this.clipboardParser.parse(data, title);
    }

    const extension = data.name.substring(data.name.lastIndexOf(".")).toLowerCase();
    switch (extension) {
      case ".epub":
        return this.epubParser.parse(data);
      case ".pdf":
        return this.pdfParser.parse(data);
      case ".txt":
        return this.txtParser.parse(data);
      default:
        throw new Error(`Unsupported file extension: ${extension}`);
    }
  }
}

export const parserService = new ParserService();
