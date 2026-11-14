import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from './env.js';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a presigned URL for uploading a file to R2.
 */
export async function generatePresignedUploadUrl(key, contentType, contentLength) {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 1800 }); // 30 min
  return url;
}

/**
 * Generate a presigned URL for downloading a file from R2.
 */
export async function generatePresignedDownloadUrl(key, originalFilename) {
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodeURIComponent(originalFilename)}"`,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  return url;
}

/**
 * Delete a single object from R2.
 */
export async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
}

/**
 * Delete multiple objects from R2.
 */
export async function deleteObjects(keys) {
  if (!keys || keys.length === 0) return;

  const command = new DeleteObjectsCommand({
    Bucket: env.R2_BUCKET_NAME,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
      Quiet: true,
    },
  });
  await s3Client.send(command);
}

/**
 * Check if an object exists in R2.
 */
export async function headObject(key) {
  const command = new HeadObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  });
  try {
    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

export default s3Client;
