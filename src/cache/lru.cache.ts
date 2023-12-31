import LRUCache from './LRUCache';

export class SystemLRUCache {
  private readonly lruCache: LRUCache<string>;

  constructor() {
    this.lruCache = new LRUCache(500);
  }

  async get(key: string): Promise<string | null> {
    const value = this.lruCache.get(key);

    if (value) {
      return value;
    }

    return null;
  }

  async set(key: string, value: string): Promise<void> {
    this.lruCache.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.lruCache.delete(key);
  }
}
