import { useState } from 'react';
import { Copy, Check, Heart, Coffee, ExternalLink, QrCode } from 'lucide-react';
import Modal from './Modal';

export default function SupportModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);
  const upiId = '8792284825@sbi';
  const payeeName = 'AKASH K KOTHARI';
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard fallback */
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Support Sky Share" maxWidth="sm:max-w-lg">
      <div className="space-y-6 text-sm text-[#bbbbbb]">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="text-white text-lg font-semibold">Help Keep Sky Share Free & Fast</h3>
          <p className="text-xs text-[#888888] max-w-sm mx-auto">
            Sky Share is an independent platform created by a student. Your support pays for Cloudflare R2 storage and high-speed servers.
          </p>
        </div>

        {/* UPI Section for India */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
              <QrCode className="w-4 h-4" /> UPI (GPay / PhonePe / Paytm)
            </span>
            <span className="text-[11px] text-[#666]">0% platform fees</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 pt-1">
            {/* Cropped Large High-Resolution UPI QR Code */}
            <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-3 shrink-0 shadow-2xl border border-white/20 flex items-center justify-center">
              <img
                src="/upi-qr.png"
                alt="UPI QR - Akash K Kothari"
                className="w-full h-full object-contain block rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[#888]">Payee Name</p>
              <p className="text-base font-semibold text-white tracking-wide">{payeeName}</p>
              <p className="text-xs text-[#666]">State Bank of India</p>
            </div>

            {/* 100% Contained Responsive UPI ID Copy Box */}
            <div className="w-full max-w-sm flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#181818] border border-[#333] hover:border-[#444] transition-colors">
              <span className="font-mono text-xs sm:text-sm text-[#22C55E] font-medium truncate select-all">
                {upiId}
              </span>
              <button
                onClick={copyUpi}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 text-xs font-medium transition-colors ml-2 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Direct UPI Intent Link for Mobile users */}
            <a
              href={upiPayUrl}
              className="sm:hidden block w-full max-w-sm py-2.5 px-3 rounded-xl bg-[#22C55E] text-black text-xs font-bold text-center hover:bg-[#16a34a] transition-colors shadow-md"
            >
              Pay via GPay / PhonePe / Paytm
            </a>

            <p className="text-xs text-[#777]">
              Tip ₹20, ₹50, ₹100 or whatever you feel like!
            </p>
          </div>
        </div>

        {/* Buy Me a Coffee / International */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#888888]">
            International / Card Support
          </span>
          <a
            href="https://buymeacoffee.com/akashk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#141414] border border-[#262626] hover:border-amber-500/40 hover:bg-[#181818] transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">☕</span>
              <div className="text-left">
                <p className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
                  Buy Me a Coffee
                </p>
                <p className="text-[11px] text-[#777]">Support with Credit/Debit Card or PayPal</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#555] group-hover:text-white transition-colors" />
          </a>
        </div>

        <div className="text-center pt-2 border-t border-[#222]">
          <p className="text-[11px] text-[#555] flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#EF4444] fill-current" /> by Akash K
          </p>
        </div>
      </div>
    </Modal>
  );
}
