interface CacheItem<T> {
  key: string;
  value: T;
}

class LRUCache<T> {
  private readonly maxSize: number;

  private cache: Map<string, CacheItem<T>>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map<string, CacheItem<T>>();
  }

  set(key: string, value: T): void {
    // find the least recently used item and remove it from the cache
    // get the list of keys in the cache and get the first one
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey); // remove the least recently used item
    }
    this.cache.set(key, { key, value });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
      this.cache.set(key, item);
      return item.value;
    }
    return undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export default LRUCache;
