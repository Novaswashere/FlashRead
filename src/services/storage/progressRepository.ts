import { ReadingProgress } from "../../types";
import { getDB } from "./indexedDB";

export const progressRepository = {
  async getById(bookId: string): Promise<ReadingProgress | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("progress", "readonly");
      const store = transaction.objectStore("progress");
      const request = store.get(bookId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  async save(progress: ReadingProgress): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("progress", "readwrite");
      const store = transaction.objectStore("progress");
      const request = store.put(progress);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async delete(bookId: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("progress", "readwrite");
      const store = transaction.objectStore("progress");
      const request = store.delete(bookId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
