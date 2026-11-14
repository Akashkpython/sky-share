import { Router } from 'express';
import {
  globalLimiter,
  uploadLimiter,
  verifyLimiter,
  downloadLimiter,
  verifyAttemptTracker,
} from '../middleware/rateLimiter.js';
import * as transferController from '../controllers/transferController.js';

const router = Router();

// Verify code - strict rate limiting + attempt tracking
router.post('/receive/verify', verifyLimiter, verifyAttemptTracker, transferController.verifyCode);

// Upload routes
router.post('/transfers/:id/upload', uploadLimiter, transferController.requestUploadUrl);
router.post('/transfers/:id/files/:fileId/confirm', uploadLimiter, transferController.confirmUpload);

// Download routes
router.get('/transfers/:id/download/:fileId', downloadLimiter, transferController.getDownloadUrl);

// General transfer routes (global limiter)
router.post('/transfers', globalLimiter, transferController.createTransfer);
router.post('/transfers/:id/complete', globalLimiter, transferController.completeTransfer);
router.get('/transfers/:id/files', globalLimiter, transferController.getFiles);
router.delete('/transfers/:id', globalLimiter, transferController.deleteTransfer);

export default router;
