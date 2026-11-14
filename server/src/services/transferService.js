import crypto from 'crypto';
import redis from '../config/redis.js';
import { generatePresignedDownloadUrl, deleteObjects } from '../config/r2.js';
import { addStorage, removeStorage } from './storageService.js';
import env from '../config/env.js';

/**
 * Create a new transfer with a unique 4-digit code.
 */
export async function createTransfer() {
  const transferId = crypto.randomUUID();
  const ttl = env.TRANSFER_EXPIRY_MINUTES * 60;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttl * 1000);

  // Generate unique 4-digit code
  let code = null;
  for (let i = 0; i < 50; i++) {
    const candidate = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const existing = await redis.get(`code:${candidate}`);
    if (!existing) {
      code = candidate;
      break;
    }
  }

  if (!code) {
    throw new Error('Unable to generate a unique code. Please try again.');
  }

  const transfer = {
    transferId,
    code,
    files: [],
    status: 'pending',
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  // Store transfer data and code mapping in Redis
  const pipeline = redis.pipeline();
  pipeline.set(`transfer:${transferId}`, JSON.stringify(transfer), 'EX', ttl);
  pipeline.set(`code:${code}`, transferId, 'EX', ttl);
  await pipeline.exec();

  return { transferId, code };
}

/**
 * Get a transfer by its ID.
 */
export async function getTransferById(transferId) {
  const data = await redis.get(`transfer:${transferId}`);
  if (!data) return null;
  return JSON.parse(data);
}

/**
 * Verify a 4-digit code and return the transfer if valid and ready.
 */
export async function verifyCode(code) {
  const transferId = await redis.get(`code:${code}`);
  if (!transferId) return null;

  const transfer = await getTransferById(transferId);
  if (!transfer || transfer.status !== 'ready') return null;

  return {
    transferId: transfer.transferId,
    files: transfer.files.map(({ fileId, originalName, mimeType, size }) => ({
      fileId,
      originalName,
      mimeType,
      size,
    })),
    createdAt: transfer.createdAt,
    expiresAt: transfer.expiresAt,
  };
}

/**
 * Add a file to a transfer and track storage usage.
 */
export async function addFile(transferId, fileData) {
  const transfer = await getTransferById(transferId);
  if (!transfer) return null;

  if (transfer.files.length >= env.MAX_FILES_PER_TRANSFER) {
    throw new Error(`Maximum ${env.MAX_FILES_PER_TRANSFER} files per transfer.`);
  }

  transfer.files.push(fileData);

  const ttl = await redis.ttl(`transfer:${transferId}`);
  await redis.set(`transfer:${transferId}`, JSON.stringify(transfer), 'EX', ttl > 0 ? ttl : env.TRANSFER_EXPIRY_MINUTES * 60);

  // Track storage usage
  if (fileData.size && fileData.size > 0) {
    await addStorage(fileData.size);
  }

  return transfer;
}

/**
 * Mark a transfer as ready for receiving.
 */
export async function completeTransfer(transferId) {
  const transfer = await getTransferById(transferId);
  if (!transfer) return null;

  if (transfer.files.length === 0) {
    throw new Error('Cannot complete a transfer with no files.');
  }

  transfer.status = 'ready';

  const ttl = await redis.ttl(`transfer:${transferId}`);
  await redis.set(`transfer:${transferId}`, JSON.stringify(transfer), 'EX', ttl > 0 ? ttl : env.TRANSFER_EXPIRY_MINUTES * 60);

  return transfer;
}

/**
 * Delete a transfer and its R2 files, releasing storage.
 */
export async function deleteTransfer(transferId) {
  const transfer = await getTransferById(transferId);
  if (!transfer) return false;

  // Calculate total file size for storage tracking
  let totalBytes = 0;
  for (const file of transfer.files) {
    totalBytes += file.size || 0;
  }

  // Delete files from R2
  const r2Keys = transfer.files.map((f) => f.r2Key).filter(Boolean);
  if (r2Keys.length > 0) {
    try {
      await deleteObjects(r2Keys);
    } catch (err) {
      console.error('Error deleting R2 objects:', err.message);
    }
  }

  // Delete Redis keys
  const pipeline = redis.pipeline();
  pipeline.del(`transfer:${transferId}`);
  pipeline.del(`code:${transfer.code}`);
  await pipeline.exec();

  // Release storage
  if (totalBytes > 0) {
    await removeStorage(totalBytes);
  }

  return true;
}

/**
 * Get files for a transfer.
 */
export async function getTransferFiles(transferId) {
  const transfer = await getTransferById(transferId);
  if (!transfer) return null;
  return transfer.files;
}

/**
 * Generate a presigned download URL for a specific file in a transfer.
 */
export async function generateDownloadUrl(transferId, fileId) {
  const transfer = await getTransferById(transferId);
  if (!transfer) return null;

  const file = transfer.files.find((f) => f.fileId === fileId);
  if (!file) return null;

  const url = await generatePresignedDownloadUrl(file.r2Key, file.originalName);
  return url;
}
