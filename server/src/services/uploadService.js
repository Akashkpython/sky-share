import crypto from 'crypto';
import { generatePresignedUploadUrl } from '../config/r2.js';
import { headObject } from '../config/r2.js';
import { checkStorageAvailable } from './storageService.js';
import env from '../config/env.js';

/**
 * Sanitize a filename: remove path separators, null bytes, limit length.
 */
function sanitizeFileName(name) {
  let sanitized = name
    .replace(/\0/g, '')           // Remove null bytes
    .replace(/[/\\]/g, '_')       // Replace path separators
    .replace(/\.\./g, '_')        // Remove directory traversal
    .trim();

  if (sanitized.length > 255) {
    const ext = sanitized.lastIndexOf('.');
    if (ext > 0) {
      const extension = sanitized.slice(ext);
      const base = sanitized.slice(0, 255 - extension.length);
      sanitized = base + extension;
    } else {
      sanitized = sanitized.slice(0, 255);
    }
  }

  if (!sanitized) {
    sanitized = 'unnamed_file';
  }

  return sanitized;
}

/**
 * Initiate a file upload: validate size, check storage quota, generate presigned URL.
 */
export async function initiateUpload(transferId, fileName, fileType, fileSize) {
  if (fileSize > env.MAX_FILE_SIZE) {
    throw Object.assign(
      new Error(`File size exceeds maximum allowed size of ${Math.round(env.MAX_FILE_SIZE / (1024 * 1024))}MB.`),
      { statusCode: 400, code: 'FILE_TOO_LARGE' }
    );
  }

  // Check global storage quota (R2 free tier protection)
  const hasRoom = await checkStorageAvailable(fileSize);
  if (!hasRoom) {
    throw Object.assign(
      new Error('Sky Share storage is full. Please try again later.'),
      { statusCode: 507, code: 'STORAGE_FULL' }
    );
  }

  const fileId = crypto.randomUUID();
  const sanitizedName = sanitizeFileName(fileName);
  const r2Key = `uploads/${transferId}/${fileId}/${sanitizedName}`;

  const uploadUrl = await generatePresignedUploadUrl(r2Key, fileType, fileSize);

  return { uploadUrl, fileId, r2Key };
}

/**
 * Verify that a file has been uploaded to R2.
 */
export async function verifyUpload(r2Key) {
  return await headObject(r2Key);
}
