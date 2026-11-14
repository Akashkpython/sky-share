import * as transferService from '../services/transferService.js';
import * as uploadService from '../services/uploadService.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

/**
 * POST /api/transfers
 */
export async function createTransfer(req, res, next) {
  try {
    const result = await transferService.createTransfer();
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/transfers/:id/upload
 */
export async function requestUploadUrl(req, res, next) {
  try {
    const { id } = req.params;
    const { fileName, fileType, fileSize } = req.body;

    if (!fileName || !fileType || fileSize === undefined) {
      throw new ValidationError('fileName, fileType, and fileSize are required.');
    }

    if (typeof fileSize !== 'number' || fileSize <= 0) {
      throw new ValidationError('fileSize must be a positive number.');
    }

    const transfer = await transferService.getTransferById(id);
    if (!transfer) {
      throw new NotFoundError('Transfer not found.');
    }

    if (transfer.status !== 'pending') {
      throw new ValidationError('Transfer is no longer accepting uploads.');
    }

    const result = await uploadService.initiateUpload(id, fileName, fileType, fileSize);

    res.status(200).json({
      success: true,
      data: {
        uploadUrl: result.uploadUrl,
        fileId: result.fileId,
        r2Key: result.r2Key,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/transfers/:id/files/:fileId/confirm
 */
export async function confirmUpload(req, res, next) {
  try {
    const { id, fileId } = req.params;
    const { fileName, fileType, fileSize, r2Key } = req.body;

    if (!fileName || !fileType || fileSize === undefined || !r2Key) {
      throw new ValidationError('fileName, fileType, fileSize, and r2Key are required.');
    }

    const transfer = await transferService.getTransferById(id);
    if (!transfer) {
      throw new NotFoundError('Transfer not found.');
    }

    // Verify file exists in R2
    const exists = await uploadService.verifyUpload(r2Key);
    if (!exists) {
      throw new ValidationError('File has not been uploaded yet.');
    }

    await transferService.addFile(id, {
      fileId,
      originalName: fileName,
      mimeType: fileType,
      size: fileSize,
      r2Key,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/transfers/:id/complete
 */
export async function completeTransfer(req, res, next) {
  try {
    const { id } = req.params;

    const transfer = await transferService.getTransferById(id);
    if (!transfer) {
      throw new NotFoundError('Transfer not found.');
    }

    const completed = await transferService.completeTransfer(id);

    res.status(200).json({
      success: true,
      data: { code: completed.code },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/receive/verify
 */
export async function verifyCode(req, res, next) {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string' || !/^\d{4}$/.test(code)) {
      throw new ValidationError('A valid 4-digit code is required.');
    }

    const transfer = await transferService.verifyCode(code);
    if (!transfer) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'INVALID_CODE',
          message: 'Invalid code or transfer not found.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/transfers/:id/files
 */
export async function getFiles(req, res, next) {
  try {
    const { id } = req.params;

    const files = await transferService.getTransferFiles(id);
    if (files === null) {
      throw new NotFoundError('Transfer not found.');
    }

    res.status(200).json({
      success: true,
      data: { files },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/transfers/:id/download/:fileId
 */
export async function getDownloadUrl(req, res, next) {
  try {
    const { id, fileId } = req.params;

    const url = await transferService.generateDownloadUrl(id, fileId);
    if (!url) {
      throw new NotFoundError('File not found.');
    }

    res.status(200).json({
      success: true,
      data: { downloadUrl: url },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/transfers/:id
 */
export async function deleteTransfer(req, res, next) {
  try {
    const { id } = req.params;

    const deleted = await transferService.deleteTransfer(id);
    if (!deleted) {
      throw new NotFoundError('Transfer not found.');
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}
