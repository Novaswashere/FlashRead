export class WordQueue {
  private words: string[] = [];
  private index = 0;

  constructor(content: string) {
    // Pure TypeScript stub signature for splitting and queueing content words.
    this.words = content.split(/\s+/).filter(Boolean);
  }

  getCurrentWord(): string | null {
    return this.words[this.index] || null;
  }

  next(): boolean {
    if (this.index < this.words.length - 1) {
      this.index++;
      return true;
    }
    return false;
  }

  previous(): boolean {
    if (this.index > 0) {
      this.index--;
      return true;
    }
    return false;
  }

  getLength(): number {
    return this.words.length;
  }

  getIndex(): number {
    return this.index;
  }

  seek(index: number): void {
    if (index >= 0 && index < this.words.length) {
      this.index = index;
    }
  }
}
