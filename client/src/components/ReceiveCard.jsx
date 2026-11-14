import { useRef, useCallback, useEffect } from 'react';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import useCodeVerify from '../hooks/useCodeVerify';
import FileItem from './FileItem';

export default function ReceiveCard() {
  const {
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
  } = useCodeVerify();

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleInput = useCallback(
    (index, value) => {
      const digit = value.replace(/\D/g, '').slice(-1);
      setDigit(index, digit);
      if (digit && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    },
    [setDigit]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !code[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
      }
      if (e.key === 'Enter' && code.every((d) => d !== '')) {
        verify();
      }
    },
    [code, verify]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
      for (let i = 0; i < 4; i++) {
        setDigit(i, pasted[i] || '');
      }
      if (pasted.length === 4) {
        inputRefs[3].current?.focus();
      }
    },
    [setDigit]
  );

  // ── Success state ──
  if (transfer && files.length > 0) {
    return (
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#111111] border border-[#262626]">
              <Download className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Files Ready</h2>
              <p className="text-xs text-[#888888] mt-0.5">
                {files.length} {files.length === 1 ? 'file' : 'files'} available
              </p>
            </div>
          </div>
          <button
            onClick={reset}
            className="p-2.5 text-[#888888] hover:text-white transition-colors rounded-xl hover:bg-[#1a1a1a]"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mb-6 max-h-72 overflow-y-auto">
          {files.map((file) => (
            <FileItem
              key={file.fileId}
              name={file.originalName || file.fileName}
              size={file.size}
              onDownload={() => downloadFile(file.fileId, file.originalName || file.fileName)}
            />
          ))}
        </div>

        {files.length > 1 && (
          <button
            onClick={downloadAll}
            className="w-full py-3.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors text-base flex items-center justify-center gap-2.5"
          >
            <Download className="w-5 h-5" />
            Download All
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[#0a1a0f] border border-[#1a3a1a]">
          <Download className="w-6 h-6 text-[#22C55E]" />
        </div>
        <h2 className="text-lg font-semibold text-[#22C55E]">Receive Files</h2>
      </div>

      {/* Code inputs */}
      <p className="text-[#888888] text-sm mb-5">Enter the 4-digit code</p>
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6" onPaste={handlePaste}>
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={inputRefs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[i]}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-[4.5rem] sm:w-16 sm:h-20 text-center text-2xl font-mono bg-[#111] border border-[#262626] rounded-xl text-white focus:border-[#22C55E] focus:outline-none transition-colors"
            autoComplete="off"
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-6 text-center">{error}</p>
      )}

      {/* Verify button */}
      <button
        onClick={verify}
        disabled={loading || code.some((d) => d === '')}
        className="w-full py-3.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors text-base disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying…
          </>
        ) : (
          'Verify Code'
        )}
      </button>
    </div>
  );
}
