/**
 * Simple in-memory file cache with TTL (5 seconds by default).
 *
 * Use this to avoid re-reading META.json, pipeline.json, etc.
 * multiple times per API request.
 *
 * Usage:
 *   import { fileCache } from "@/lib/cache";
 *   const meta = await fileCache.walk("meta:PAOS/PIPE-123", () =>
 *     JSON.parse(await readFile(path, "utf-8"))
 *   );
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class FileCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private ttl: number;

  constructor(ttlMs = 5000) {
    this.ttl = ttlMs;
  }

  /** Get a cached value. Returns null if missing or expired. */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  /** Set a cached value. */
  set<T>(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttl });
  }

  /** Get-or-fetch: returns cached value if fresh, otherwise calls fetcher and caches result. */
  async wrap<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const existing = this.get<T>(key);
    if (existing !== null) return existing;
    const value = await fetcher();
    this.set(key, value);
    return value;
  }

  /** Read a text file, caching it by absolute path. */
  async readFile(path: string): Promise<string> {
    return this.wrap(`file:${path}`, async () => {
      const { readFile } = await import("fs/promises");
      return readFile(path, "utf-8");
    });
  }

  /** Parse a JSON file, caching the parsed result by path. */
  async readJSON<T>(path: string): Promise<T> {
    return this.wrap(`json:${path}`, async () => {
      const { readFile } = await import("fs/promises");
      return JSON.parse(await readFile(path, "utf-8")) as T;
    });
  }

  /** Invalidate a specific key or entire cache. */
  invalidate(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }

  /** Number of entries currently in the cache. */
  get size(): number {
    return this.store.size;
  }
}

/** Singleton — shared across all route handlers in the same Node.js process. */
export const fileCache = new FileCache(5_000);
