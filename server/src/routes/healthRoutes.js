import { Router } from 'express';
import { getUsedStorage } from '../services/storageService.js';
import env from '../config/env.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const usedBytes = await getUsedStorage();
    const maxBytes = env.MAX_TOTAL_STORAGE;

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      storage: {
        usedBytes,
        maxBytes,
        usedMB: Math.round(usedBytes / (1024 * 1024)),
        maxMB: Math.round(maxBytes / (1024 * 1024)),
        percentUsed: maxBytes > 0 ? Math.round((usedBytes / maxBytes) * 100) : 0,
      },
    });
  } catch {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
});

export default router;
