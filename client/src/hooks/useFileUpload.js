import { useState, useCallback } from 'react';
import {
  createTransfer,
  requestUploadUrl,
  uploadFileToR2,
  confirmUpload,
  completeTransfer,
} from '../services/api';

export default function useFileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState(null);
  const [transferId, setTransferId] = useState(null);
  const [code, setCode] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | complete | error

  const addFiles = useCallback((fileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
    setError(null);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const upload = useCallback(async () => {
    if (files.length === 0) return;

    setUploading(true);
    setStatus('uploading');
    setError(null);
    setProgress({});
    setOverallProgress(0);

    try {
      const { transferId: tid, code: initialCode } = await createTransfer();
      setTransferId(tid);

      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      let uploadedSize = 0;
      const fileProgress = {};

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { uploadUrl, fileId, r2Key } = await requestUploadUrl(
          tid,
          file.name,
          file.type || 'application/octet-stream',
          file.size
        );

        await uploadFileToR2(uploadUrl, file, (fraction) => {
          fileProgress[i] = fraction;
          setProgress({ ...fileProgress });

          const currentUploaded = uploadedSize + fraction * file.size;
          setOverallProgress(totalSize > 0 ? currentUploaded / totalSize : 0);
        });

        fileProgress[i] = 1;
        uploadedSize += file.size;
        setProgress({ ...fileProgress });
        setOverallProgress(totalSize > 0 ? uploadedSize / totalSize : 1);

        await confirmUpload(tid, fileId, file.name, file.type || 'application/octet-stream', file.size, r2Key);
      }

      const result = await completeTransfer(tid);
      setCode(result.code);
      setStatus('complete');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Upload failed');
      setStatus('error');
    } finally {
      setUploading(false);
    }
  }, [files]);

  const reset = useCallback(() => {
    setFiles([]);
    setUploading(false);
    setProgress({});
    setOverallProgress(0);
    setError(null);
    setTransferId(null);
    setCode(null);
    setStatus('idle');
  }, []);

  return {
    files,
    uploading,
    progress,
    overallProgress,
    error,
    transferId,
    code,
    status,
    addFiles,
    removeFile,
    upload,
    reset,
  };
}
