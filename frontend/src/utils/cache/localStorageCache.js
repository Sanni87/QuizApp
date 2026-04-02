// src/utils/cache/localStorageCache.js
// Simple localStorage cache with soft/hard expiration

/**
 * Get data from cache or factory with soft/hard expiration.
 * @param {string} key - Cache key
 * @param {Function} factory - Async function to fetch data if not cached or expired
 * @param {Object} options - { softTtlMs, hardTtlMs } in milliseconds
 * @returns {Promise<any>} - Resolves to cached or fetched data
 */
export async function getCachedData(key, factory, { softTtlMs = 5 * 60 * 1000, hardTtlMs = 60 * 60 * 1000 } = {}) {
  const now = Date.now();
  const cacheRaw = localStorage.getItem(key);
  let cacheObj = null;
  if (cacheRaw) {
    try {
      cacheObj = JSON.parse(cacheRaw);
    } catch {}
  }

  if (cacheObj) {
    if (now < cacheObj.softExpire) {
      // Not expired (soft)
      return cacheObj.data;
    } else if (now < cacheObj.hardExpire) {
      // Soft expired, hard not expired
      // Return cached data, but refresh in background
      factory().then((freshData) => {
        setCache(key, freshData, softTtlMs, hardTtlMs);
      });
      return cacheObj.data;
    } else {
      // Hard expired
      localStorage.removeItem(key);
    }
  }

  // No cache or hard expired
  const data = await factory();
  setCache(key, data, softTtlMs, hardTtlMs);
  return data;
}

/**
 * Set cache entry
 * @param {string} key
 * @param {any} data
 * @param {number} softTtlMs
 * @param {number} hardTtlMs
 */
export function setCache(key, data, softTtlMs, hardTtlMs) {
  const now = Date.now();
  const cacheObj = {
    key,
    data,
    inserted: now,
    softExpire: now + softTtlMs,
    hardExpire: now + hardTtlMs,
  };
  localStorage.setItem(key, JSON.stringify(cacheObj));
}

/**
 * Remove cache entry
 * @param {string} key
 */
export function removeCache(key) {
  localStorage.removeItem(key);
}

/**
 * Get raw cache entry (for debugging)
 * @param {string} key
 */
export function getCacheEntry(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
