import { useState, useCallback, useEffect } from 'react';
import { verifyCode, getDownloadUrl } from '../services/api';

export default function useCodeVerify() {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transfer, setTransfer] = useState(null);
  const [files, setFiles] = useState([]);

  // Check URL query param on mount (e.g. ?code=1234 from QR code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam && /^\d{4}$/.test(codeParam)) {
      const digits = codeParam.split('');
      setCode(digits);
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await verifyCode(codeParam);
          setTransfer(data);
          setFiles(data.files || []);
        } catch (err) {
          setError(err.response?.data?.error?.message || err.message || 'Verification failed');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  const setDigit = useCallback((index, value) => {
    setCode((prev) => {
      const next = [...prev];
      next[index] = value.slice(-1);
      return next;
    });
    setError(null);
  }, []);

  const verify = useCallback(async () => {
    const codeStr = code.join('');
    if (codeStr.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await verifyCode(codeStr);
      setTransfer(data);
      setFiles(data.files || []);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [code]);

  const downloadFile = useCallback(async (fileId, fileName) => {
    if (!transfer) return;
    try {
      const { downloadUrl } = await getDownloadUrl(transfer.transferId, fileId);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName || 'download';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Download failed');
    }
  }, [transfer]);

  const downloadAll = useCallback(async () => {
    for (const file of files) {
      await downloadFile(file.fileId, file.originalName || file.fileName);
    }
  }, [files, downloadFile]);

  const reset = useCallback(() => {
    setCode(['', '', '', '']);
    setLoading(false);
    setError(null);
    setTransfer(null);
    setFiles([]);
  }, []);

  return {
    code,
    loading,
    error,
    transfer,
    files,
    setDigit,
    verify,
    downloadFile,
    downloadAll,
    reset,
  };
}
