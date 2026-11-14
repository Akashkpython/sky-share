import { useRef, useState, useCallback } from 'react';
import { Upload, Copy, Check, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import useFileUpload from '../hooks/useFileUpload';
import FileItem from './FileItem';
import ProgressBar from './ProgressBar';

export default function SendCard() {
  const {
    files,
    uploading,
    progress,
    overallProgress,
    error,
    code,
    status,
    addFiles,
    removeFile,
    upload,
    reset,
  } = useFileUpload();

  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const copyCode = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }, [code]);

  // ── Complete state ──
  if (status === 'complete' && code) {
    return (
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 md:p-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2.5 text-[#22C55E]">
          <Check className="w-6 h-6" />
          <span className="text-base font-medium">Upload Complete</span>
        </div>

        <p className="text-[#888888] text-sm">Share this code with the receiver</p>

        <div
          className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.35em] text-[#22C55E] select-all cursor-pointer"
          onClick={copyCode}
        >
          {code}
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-[#262626] text-sm text-[#888888] hover:text-white hover:border-[#444] transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>

        <div className="p-3 bg-white rounded-2xl">
          <QRCodeSVG
            value={`https://skyshare.app/receive?code=${code}`}
            size={120}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
            className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
          />
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2.5 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          New Transfer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[#1a0a0a] border border-[#3a1a1a]">
          <Upload className="w-6 h-6 text-[#EF4444]" />
        </div>
        <h2 className="text-lg font-semibold text-[#EF4444]">Send Files</h2>
      </div>

      {/* Drag & Drop Zone */}
      {!uploading && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-colors mb-5 ${
            dragging
              ? 'border-[#22C55E] bg-[#22C55E]/5'
              : 'border-[#262626] hover:border-[#444]'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-[#EF4444]/40" />
          <p className="text-sm text-[#888888]">
            Drag & drop files here, or <span className="text-white underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-[#555] mt-2">
            Up to 50 MB per file · Max 5 files
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files.length) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-6 max-h-56 overflow-y-auto">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="relative">
              <FileItem
                name={file.name}
                size={file.size}
                onRemove={uploading ? undefined : () => removeFile(i)}
              />
              {uploading && progress[i] !== undefined && (
                <ProgressBar value={progress[i]} className="mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2.5">
            <span className="text-[#888888]">Uploading…</span>
            <span className="text-white font-medium">{Math.round(overallProgress * 100)}%</span>
          </div>
          <ProgressBar value={overallProgress} />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-6">{error}</p>
      )}

      {/* Upload button */}
      {!uploading && files.length > 0 && status !== 'complete' && (
        <button
          onClick={upload}
          className="w-full py-3.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors text-base"
        >
          Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
        </button>
      )}
    </div>
  );
}
