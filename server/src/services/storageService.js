import redis from '../config/redis.js';
import env from '../config/env.js';

const STORAGE_KEY = 'storage:total_bytes';

/**
 * Get the current total storage used (bytes).
 */
export async function getUsedStorage() {
  const bytes = await redis.get(STORAGE_KEY);
  return parseInt(bytes, 10) || 0;
}

/**
 * Add bytes to the total storage counter.
 */
export async function addStorage(bytes) {
  if (bytes <= 0) return;
  await redis.incrby(STORAGE_KEY, bytes);
}

/**
 * Remove bytes from the total storage counter.
 */
export async function removeStorage(bytes) {
  if (bytes <= 0) return;
  await redis.decrby(STORAGE_KEY, bytes);

  // Clamp to zero (safety net against negative drift)
  const current = await redis.get(STORAGE_KEY);
  if (parseInt(current, 10) < 0) {
    await redis.set(STORAGE_KEY, '0');
  }
}

/**
 * Check whether there is room to store `fileSize` more bytes.
 * Returns true if the upload is allowed.
 */
export async function checkStorageAvailable(fileSize) {
  const used = await getUsedStorage();
  return used + fileSize <= env.MAX_TOTAL_STORAGE;
}

/**
 * Recalculate storage from all active transfers (disaster recovery).
 * Call manually if the counter drifts.
 */
export async function recalculateStorage() {
  let cursor = '0';
  let totalBytes = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'transfer:*', 'COUNT', 100);
    cursor = nextCursor;

    for (const key of keys) {
      try {
        const data = await redis.get(key);
        if (!data) continue;
        const transfer = JSON.parse(data);
        for (const file of transfer.files || []) {
          totalBytes += file.size || 0;
        }
      } catch {
        // skip malformed entries
      }
    }
  } while (cursor !== '0');

  await redis.set(STORAGE_KEY, String(totalBytes));
  return totalBytes;
}

