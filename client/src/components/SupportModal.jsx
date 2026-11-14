import { useState } from 'react';
import { Copy, Check, Heart, Coffee, ExternalLink, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from './Modal';

export default function SupportModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);
  const upiId = '8792284825@upi'; // Default UPI ID for Akash K
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=Akash%20K&cu=INR`;

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
    <Modal open={open} onClose={onClose} title="Support Sky Share">
      <div className="space-y-6 text-sm text-[#bbbbbb]">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="text-white text-lg font-semibold">Help Keep Sky Share Free & Fast</h3>
          <p className="text-xs text-[#888888] max-w-sm mx-auto">
            Sky Share is an independent, ad-light platform created by a student. Your support pays for Cloudflare R2 storage and high-speed servers.
          </p>
        </div>

        {/* UPI Section for India */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-[#262626] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5">
              <QrCode className="w-4 h-4" /> UPI (GPay / PhonePe / Paytm)
            </span>
            <span className="text-[11px] text-[#666]">0% platform fees</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {/* Real UPI QR Code */}
            <div className="p-2.5 bg-white rounded-xl shrink-0 shadow-md">
              <QRCodeSVG
                value={upiPayUrl}
                size={110}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <p className="text-xs text-[#999]">
                Scan with any UPI app or copy the UPI ID directly:
              </p>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#181818] border border-[#333]">
                <span className="font-mono text-xs text-white select-all">{upiId}</span>
                <button
                  onClick={copyUpi}
                  className="flex items-center gap-1 text-xs text-[#22C55E] hover:text-[#4ade80] transition-colors ml-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-[#666]">
                Tip ₹20, ₹50, or whatever you feel like!
              </p>
            </div>
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
