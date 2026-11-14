import { Sparkles, Check, ArrowRight, ShieldCheck, Zap, Clock, HardDrive, Lock } from 'lucide-react';
import Modal from './Modal';

export default function ProModal({ open, onClose }) {
  const handleUpgrade = () => {
    // Direct link to WhatsApp/Email or custom checkout
    window.open(
      'https://wa.me/918792284825?text=Hi%20Akash,%20I%20want%20to%20upgrade%20to%20Sky%20Share%20Pro!',
      '_blank'
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Sky Share Pro">
      <div className="space-y-6 text-sm text-[#bbbbbb]">
        {/* Header Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Premium Tier
          </div>
          <h3 className="text-white text-xl font-bold">Transfer Without Limits</h3>
          <p className="text-xs text-[#888888] max-w-sm mx-auto">
            Designed for students, power users, and creators who need larger files and longer storage.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free Tier */}
          <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-[#222222] space-y-3">
            <div className="border-b border-[#222] pb-3">
              <span className="text-xs uppercase text-[#888] font-semibold tracking-wider">Free</span>
              <div className="text-xl font-bold text-white mt-1">₹0</div>
              <p className="text-[11px] text-[#666]">Standard sharing</p>
            </div>
            <ul className="space-y-2 text-xs text-[#888]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> Max 50 MB / file
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> 15-minute auto-expiry
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> 5 files per transfer
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> 4-digit code access
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="relative p-4 rounded-2xl bg-[#141410] border border-amber-500/40 shadow-lg shadow-amber-500/5 space-y-3">
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="border-b border-amber-500/20 pb-3">
              <span className="text-xs uppercase text-amber-400 font-semibold tracking-wider">Pro</span>
              <div className="text-xl font-bold text-white mt-1">
                ₹49 <span className="text-xs font-normal text-[#888]">/ month</span>
              </div>
              <p className="text-[11px] text-amber-200/70">Less than a cup of tea</p>
            </div>
            <ul className="space-y-2 text-xs text-[#ddd]">
              <li className="flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium text-white">Up to 1 GB</span> per transfer
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium text-white">24 hours</span> file expiration
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium text-white">20 files</span> at once
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Password & PIN protection
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Priority cloud speed
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-semibold text-sm transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Upgrade to Pro (Instant Activation)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-[#666]">
          Have questions or want student discounts? Contact Akash directly at +91 8792284825.
        </p>
      </div>
    </Modal>
  );
}
