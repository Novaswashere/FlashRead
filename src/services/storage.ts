import { Book, ParsedBook } from "../types";

export interface IStorageService {
  getBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | null>;
  getParsedBook(bookId: string): Promise<ParsedBook | null>;
  saveBook(book: Book, parsedData: ParsedBook): Promise<void>;
  deleteBook(bookId: string): Promise<void>;
}

export class StorageService implements IStorageService {
  async getBooks(): Promise<Book[]> {
    return []; // Placeholder stub
  }

  async getBookById(id: string): Promise<Book | null> {
    return null; // Placeholder stub
  }

  async getParsedBook(bookId: string): Promise<ParsedBook | null> {
    return null; // Placeholder stub
  }

  async saveBook(book: Book, parsedData: ParsedBook): Promise<void> {
    return; // Placeholder stub
  }

  async deleteBook(bookId: string): Promise<void> {
    return; // Placeholder stub
  }
}

export const storageService = new StorageService();
