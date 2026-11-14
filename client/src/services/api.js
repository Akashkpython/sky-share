import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

export async function createTransfer() {
  const { data } = await api.post('/api/transfers');
  return data.data;
}

export async function requestUploadUrl(transferId, fileName, fileType, fileSize) {
  const { data } = await api.post(`/api/transfers/${transferId}/upload`, {
    fileName,
    fileType,
    fileSize,
  });
  return data.data;
}

export async function uploadFileToR2(uploadUrl, file, onProgress) {
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    onUploadProgress: onProgress
      ? (e) => onProgress(e.loaded / (e.total || file.size))
      : undefined,
  });
}

export async function confirmUpload(transferId, fileId, fileName, fileType, fileSize, r2Key) {
  const { data } = await api.post(`/api/transfers/${transferId}/files/${fileId}/confirm`, {
    fileName,
    fileType,
    fileSize,
    r2Key,
  });
  return data;
}

export async function completeTransfer(transferId) {
  const { data } = await api.post(`/api/transfers/${transferId}/complete`);
  return data.data;
}

export async function verifyCode(code) {
  const { data } = await api.post('/api/receive/verify', { code });
  return data.data;
}

export async function getFiles(transferId) {
  const { data } = await api.get(`/api/transfers/${transferId}/files`);
  return data.data;
}

export async function getDownloadUrl(transferId, fileId) {
  const { data } = await api.get(`/api/transfers/${transferId}/download/${fileId}`);
  return data.data;
}

export async function deleteTransfer(transferId) {
  const { data } = await api.delete(`/api/transfers/${transferId}`);
  return data;
}

export async function createPaymentOrder(amount, currency = 'INR', receipt) {
  const { data } = await api.post('/api/create-order', {
    amount,
    currency,
    receipt,
  });
  return data;
}

export async function verifyPayment(paymentData) {
  const { data } = await api.post('/api/verify-payment', paymentData);
  return data;
}

export default api;
