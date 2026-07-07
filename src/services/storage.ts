import { bookRepository } from "./storage/bookRepository";
import { parsedBookRepository } from "./storage/parsedBookRepository";
import { progressRepository } from "./storage/progressRepository";
import { assetRepository } from "./storage/assetRepository";

export const storageService = {
  books: bookRepository,
  parsedBooks: parsedBookRepository,
  progress: progressRepository,
  assets: assetRepository,
};

export type StorageServiceType = typeof storageService;
