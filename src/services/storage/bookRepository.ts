import { Book } from "../../types";
import { getDB } from "./indexedDB";

export const bookRepository = {
  async getAll(): Promise<Book[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("books", "readonly");
      const store = transaction.objectStore("books");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async getById(id: string): Promise<Book | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("books", "readonly");
      const store = transaction.objectStore("books");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  async save(book: Book): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("books", "readwrite");
      const store = transaction.objectStore("books");
      const request = store.put(book);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("books", "readwrite");
      const store = transaction.objectStore("books");
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
