import { ImageAsset } from "../../types/document";
import { getDB } from "./indexedDB";

export class AssetRepository {
  private objectUrls: Map<string, string> = new Map();

  async getAsset(id: string): Promise<ImageAsset | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("assets", "readonly");
      const store = transaction.objectStore("assets");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAsset(asset: ImageAsset): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("assets", "readwrite");
      const store = transaction.objectStore("assets");
      const request = store.put(asset);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteAsset(id: string): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("assets", "readwrite");
      const store = transaction.objectStore("assets");
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAssetUrl(id: string): Promise<string | null> {
    // Check if we already created an Object URL for this asset
    if (this.objectUrls.has(id)) {
      return this.objectUrls.get(id)!;
    }

    const asset = await this.getAsset(id);
    if (!asset) return null;

    if (typeof window !== "undefined") {
      const url = window.URL.createObjectURL(asset.data);
      this.objectUrls.set(id, url);
      return url;
    }
    return null;
  }

  revokeAssetUrl(id: string): void {
    const url = this.objectUrls.get(id);
    if (url && typeof window !== "undefined") {
      window.URL.revokeObjectURL(url);
      this.objectUrls.delete(id);
    }
  }

  revokeAll(): void {
    if (typeof window !== "undefined") {
      this.objectUrls.forEach((url) => {
        window.URL.revokeObjectURL(url);
      });
    }
    this.objectUrls.clear();
  }
}

export const assetRepository = new AssetRepository();
