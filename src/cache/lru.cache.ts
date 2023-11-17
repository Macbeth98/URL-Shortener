import IORedis from 'ioredis';
import LRUCache from './LRUCache';

export class SCache {
  private readonly lruCache: LRUCache<string>;

  private readonly redis: IORedis;

  constructor() {
    this.lruCache = new LRUCache(500);
    // this.redis = new IORedis();
  }

  async get(key: string): Promise<string | null> {
    const value = this.lruCache.get(key);

    if (value) {
      return value;
    }

    return null;

    // const redisValue = await this.redis.get(key);

    // if (redisValue) {
    //   this.lruCache.set(key, redisValue);
    // }

    // return redisValue;
  }

  async set(key: string, value: string): Promise<void> {
    this.lruCache.set(key, value);
    // await this.redis.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.lruCache.delete(key);
    // await this.redis.del(key);
  }
}
