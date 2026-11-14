import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  X,
  Download,
} from 'lucide-react';

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getFileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml', 'yml', 'yaml', 'sh', 'rb', 'go', 'rs'];
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'];

  if (imageExts.includes(ext)) return FileImage;
  if (videoExts.includes(ext)) return FileVideo;
  if (audioExts.includes(ext)) return FileAudio;
  if (archiveExts.includes(ext)) return FileArchive;
  if (codeExts.includes(ext)) return FileCode;
  if (docExts.includes(ext)) return FileText;
  return File;
}

export default function FileItem({ name, size, onRemove, onDownload }) {
  const Icon = getFileIcon(name);

  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#111111] border border-[#262626] group">
      <Icon className="w-5 h-5 text-[#888888] shrink-0" />
      <span className="text-sm text-white truncate flex-1 min-w-0">{name}</span>
      <span className="text-xs text-[#888888] shrink-0">{formatSize(size)}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-[#888888] hover:text-white transition-colors shrink-0 rounded-lg hover:bg-[#1a1a1a]"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {onDownload && (
        <button
          onClick={onDownload}
          className="p-1.5 text-[#888888] hover:text-[#22C55E] transition-colors shrink-0 rounded-lg hover:bg-[#1a1a1a]"
          aria-label="Download file"
        >
          <Download className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
