import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Mail, Phone, Github, Linkedin, Instagram, ExternalLink, Coffee, Sparkles } from 'lucide-react';
import Modal from './Modal';
import SupportModal from './SupportModal';
import ProModal from './ProModal';

export default function Header() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [proOpen, setProOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#090909]/80 backdrop-blur-sm border-b border-[#262626]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Sky Share" className="h-7 sm:h-8" />
          </Link>
          <nav className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => setProOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>PRO</span>
            </button>
            <button
              onClick={() => setSupportOpen(true)}
              className="flex items-center gap-1 text-[#888888] text-sm hover:text-white transition-colors cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Support</span>
            </button>
            <button
              onClick={() => setHelpOpen(true)}
              className="text-[#888888] text-sm hover:text-white transition-colors"
            >
              Help
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="text-[#888888] text-sm hover:text-white transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      {/* Support / Donate Modal */}
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />

      {/* Pro Modal */}
      <ProModal open={proOpen} onClose={() => setProOpen(false)} />

      {/* Help Modal */}
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="How it works">
        <div className="space-y-5 text-sm text-[#bbbbbb] leading-relaxed">
          <div>
            <h3 className="text-white font-medium text-base mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold">1</span>
              Send Files
            </h3>
            <ul className="space-y-1.5 text-[#999] ml-8">
              <li>Click the upload area or drag & drop your files.</li>
              <li>Click "Upload" to send them to secure cloud storage.</li>
              <li>You'll receive a unique 4-digit code.</li>
              <li>Share the code (or QR) with your recipient.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium text-base mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold">2</span>
              Receive Files
            </h3>
            <ul className="space-y-1.5 text-[#999] ml-8">
              <li>Enter the 4-digit code you received.</li>
              <li>Click "Verify Code" to access the files.</li>
              <li>Download individual files or all at once.</li>
            </ul>
          </div>
          <div className="border-t border-[#262626] pt-4 space-y-2">
            <h3 className="text-white font-medium text-base">Good to know</h3>
            <ul className="space-y-1.5 text-[#999]">
              <li>📁 Max <span className="text-white">50 MB</span> per file, up to <span className="text-white">5 files</span> per transfer.</li>
              <li>⏰ Files auto-delete after <span className="text-white">15 minutes</span>.</li>
              <li>🔒 No account needed. No data stored permanently.</li>
              <li>📱 Works on desktop, tablet, and mobile.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Contact Modal */}
      <HeaderContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

function HeaderContactModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg lg:max-w-xl bg-[#0a0a0a] border border-[#262626] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#22C55E]/8 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 text-[#666] hover:text-white transition-colors rounded-xl hover:bg-[#1a1a1a]"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14 flex flex-col items-center">
          <div className="relative mb-6 animate-float-in">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[#262626] shadow-xl ring-4 ring-[#22C55E]/10">
              <img src="/developer.png" alt="Akash K" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#22C55E] rounded-full border-[3px] border-[#0a0a0a] animate-pulse" />
          </div>

          <div className="text-center mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5">Akash K</h3>
            <p className="text-[#22C55E] text-sm font-medium tracking-wide uppercase">Founder & Developer</p>
          </div>

          <p className="text-[#888888] text-sm text-center max-w-xs mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Building tools that simplify your digital life.
          </p>

          <div className="w-full space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <a href="mailto:akashkkotari@gmail.com" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#22C55E]/40 transition-all duration-300 group">
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#262626] group-hover:border-[#22C55E]/30 transition-colors">
                <Mail className="w-5 h-5 text-[#888888] group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666] mb-0.5">Email</p>
                <p className="text-sm text-[#cccccc] group-hover:text-white transition-colors truncate">akashkkotari@gmail.com</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
            </a>

            <a href="tel:+918792284825" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#22C55E]/40 transition-all duration-300 group">
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#262626] group-hover:border-[#22C55E]/30 transition-colors">
                <Phone className="w-5 h-5 text-[#888888] group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666] mb-0.5">Phone</p>
                <p className="text-sm text-[#cccccc] group-hover:text-white transition-colors">+91 8792284825</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
            </a>

            <a href="https://github.com/Akashkpython" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#22C55E]/40 transition-all duration-300 group">
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#262626] group-hover:border-[#22C55E]/30 transition-colors">
                <Github className="w-5 h-5 text-[#888888] group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666] mb-0.5">GitHub</p>
                <p className="text-sm text-[#cccccc] group-hover:text-white transition-colors">Akashkpython</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
            </a>

            <a href="https://www.linkedin.com/in/akash-k-kotari-30b3a2187" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#22C55E]/40 transition-all duration-300 group">
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#262626] group-hover:border-[#22C55E]/30 transition-colors">
                <Linkedin className="w-5 h-5 text-[#888888] group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666] mb-0.5">LinkedIn</p>
                <p className="text-sm text-[#cccccc] group-hover:text-white transition-colors">Akash K Kotari</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
            </a>

            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#111111] border border-[#262626] opacity-50 cursor-default">
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#262626]">
                <Instagram className="w-5 h-5 text-[#888888]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#666] mb-0.5">Instagram</p>
                <p className="text-sm text-[#666] italic">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-[#444] animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <span>Built with</span>
            <span className="text-[#EF4444]">♥</span>
            <span>by Akash K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
