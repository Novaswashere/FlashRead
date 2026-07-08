import { ParsedBook } from "../../types";
import { getDB } from "./indexedDB";

export const parsedBookRepository = {
  async getById(bookId: string): Promise<ParsedBook | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("parsed_books", "readonly");
      const store = transaction.objectStore("parsed_books");
      const request = store.get(bookId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  async save(parsedBook: ParsedBook): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("parsed_books", "readwrite");
      const store = transaction.objectStore("parsed_books");
      const request = store.put(parsedBook);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async delete(bookId: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("parsed_books", "readwrite");
      const store = transaction.objectStore("parsed_books");
      const request = store.delete(bookId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
