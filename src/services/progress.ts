import { ReadingProgress } from "../types";

export interface IProgressService {
  getProgress(bookId: string): Promise<ReadingProgress | null>;
  saveProgress(progress: ReadingProgress): Promise<void>;
  syncProgress(progress: ReadingProgress): Promise<void>;
}

export class ProgressService implements IProgressService {
  async getProgress(bookId: string): Promise<ReadingProgress | null> {
    return null; // Placeholder stub
  }

  async saveProgress(progress: ReadingProgress): Promise<void> {
    return; // Placeholder stub
  }

  async syncProgress(progress: ReadingProgress): Promise<void> {
    return; // Placeholder stub
  }
}

export const progressService = new ProgressService();
