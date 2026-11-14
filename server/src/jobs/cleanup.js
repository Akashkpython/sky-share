import cron from 'node-cron';
import redis from '../config/redis.js';
import { deleteObjects } from '../config/r2.js';
import { removeStorage } from '../services/storageService.js';

/**
 * Start the hourly cleanup job to remove expired transfers.
 */
export function startCleanupJob() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('Cleanup: starting scan for expired transfers...');

    let cursor = '0';
    let removedCount = 0;
    let freedBytes = 0;

    try {
      do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'transfer:*', 'COUNT', 100);
        cursor = nextCursor;

        for (const key of keys) {
          try {
            const data = await redis.get(key);
            if (!data) continue;

            const transfer = JSON.parse(data);
            const expiresAt = new Date(transfer.expiresAt);

            if (expiresAt < new Date()) {
              // Calculate storage to release
              let transferBytes = 0;
              for (const file of transfer.files || []) {
                transferBytes += file.size || 0;
              }

              // Delete R2 files
              const r2Keys = (transfer.files || []).map((f) => f.r2Key).filter(Boolean);
              if (r2Keys.length > 0) {
                try {
                  await deleteObjects(r2Keys);
                } catch (err) {
                  console.error(`Cleanup: error deleting R2 files for ${transfer.transferId}:`, err.message);
                }
              }

              // Delete Redis keys
              const pipeline = redis.pipeline();
              pipeline.del(key);
              if (transfer.code) {
                pipeline.del(`code:${transfer.code}`);
              }
              await pipeline.exec();

              // Release storage
              if (transferBytes > 0) {
                await removeStorage(transferBytes);
                freedBytes += transferBytes;
              }

              removedCount++;
            }
          } catch (err) {
            console.error(`Cleanup: error processing key ${key}:`, err.message);
          }
        }
      } while (cursor !== '0');

      const freedMB = (freedBytes / (1024 * 1024)).toFixed(2);
      console.log(`Cleanup: removed ${removedCount} expired transfers, freed ${freedMB} MB`);
    } catch (err) {
      console.error('Cleanup: job error:', err.message);
    }
  });

  console.log('Cleanup job scheduled (runs every hour)');
}
