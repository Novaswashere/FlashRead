export interface MappedError {
  title: string;
  description: string;
}

export function mapError(code: string, rawMessage: string): MappedError {
  const cleanCode = code ? code.toUpperCase() : "UNKNOWN_ERROR";

  switch (cleanCode) {
    case "UNSUPPORTED_FORMAT":
      return {
        title: "Unsupported File Format",
        description: "This file format is not supported. ReadPilot only supports EPUB, PDF, and TXT files. Please convert your document into one of these formats and try again.",
      };
    case "CORRUPTED_FILE":
      return {
        title: "Corrupted Document File",
        description: "The file was corrupted. The file's internal structure seems to be corrupted. Try downloading or generating a fresh copy of the file and try again.",
      };
    case "ENCRYPTED_PDF":
      return {
        title: "Password-Protected PDF",
        description: "This PDF is password-protected. We cannot read encrypted files. Please remove the password protection from the document and try again.",
      };
    case "INVALID_EPUB":
      return {
        title: "Invalid EPUB Book",
        description: "The EPUB file appears invalid or poorly formatted. The internal table of contents or package information is missing. Try downloading the e-book from a different source or convert it using a utility like Calibre.",
      };
    case "EMPTY_DOCUMENT":
      return {
        title: "Empty Document File",
        description: "This document contains no readable text. It may be a scanned image PDF without OCR text, or an empty text file. Please ensure the file has selectable text, or paste your text directly.",
      };
    case "PARSER_TIMEOUT":
      return {
        title: "Import Request Timed Out",
        description: "The file upload timed out. The document might be too large or complex for the browser to process. Try splitting it into smaller sections or pasting the text in smaller segments.",
      };
    default:
      return {
        title: "Document Ingest Failed",
        description: rawMessage || "Something went wrong while reading the file. Please reload the page and try again, or paste the text directly.",
      };
  }
}
