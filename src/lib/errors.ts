export class ParserError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "ParserError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnsupportedFormatError extends ParserError {
  constructor(message: string) {
    super(message, "UNSUPPORTED_FORMAT");
    this.name = "UnsupportedFormatError";
  }
}

export class CorruptedFileError extends ParserError {
  constructor(message: string) {
    super(message, "CORRUPTED_FILE");
    this.name = "CorruptedFileError";
  }
}

export class EncryptedPdfError extends ParserError {
  constructor(message: string) {
    super(message, "ENCRYPTED_PDF");
    this.name = "EncryptedPdfError";
  }
}

export class InvalidEpubError extends ParserError {
  constructor(message: string) {
    super(message, "INVALID_EPUB");
    this.name = "InvalidEpubError";
  }
}

export class EmptyDocumentError extends ParserError {
  constructor(message: string) {
    super(message, "EMPTY_DOCUMENT");
    this.name = "EmptyDocumentError";
  }
}

export class ParserTimeoutError extends ParserError {
  constructor(message: string) {
    super(message, "PARSER_TIMEOUT");
    this.name = "ParserTimeoutError";
  }
}
