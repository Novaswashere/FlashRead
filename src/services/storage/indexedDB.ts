const DB_NAME = "FlashReadDB";
const DB_VERSION = 1;

export function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported on this platform"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (event.oldVersion < 1) {
        // Version 1 Schema Setup
        db.createObjectStore("books", { keyPath: "id" });
        db.createObjectStore("parsed_books", { keyPath: "bookId" });
        db.createObjectStore("progress", { keyPath: "bookId" });
        db.createObjectStore("assets", { keyPath: "id" });
      }
      // Future version migrations can be appended here
    };
  });
}
