export default function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className={`w-full h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-[#22C55E] transition-all duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(value * 100, 0), 100)}%` }}
      />
    </div>
  );
}
