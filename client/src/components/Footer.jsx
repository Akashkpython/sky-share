import { useState } from 'react';
import Modal from './Modal';
import SupportModal from './SupportModal';

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-[#262626] py-10 lg:py-14 mt-20 lg:mt-28">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-5">
          <span className="text-[#888888] text-sm lg:text-base font-bold tracking-[0.25em]">
            SKY SHARE - Made by Akash K Kothari
          </span>
          <div className="flex flex-wrap justify-center items-center gap-4 text-[#888888] text-sm">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <span className="text-[#333]">·</span>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
            <span className="text-[#333]">·</span>
            <button
              onClick={() => setAboutOpen(true)}
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <span className="text-[#333]">·</span>
            <button
              onClick={() => setSupportOpen(true)}
              className="hover:text-amber-300 text-amber-400/90 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Support</span>
              <span>☕</span>
            </button>
          </div>
          <p className="text-[#555] text-xs">
            © 2026 Sky Share. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Support Modal */}
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />

      {/* Privacy Modal */}
      <Modal open={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <div className="space-y-4 text-sm text-[#bbbbbb] leading-relaxed">
          <p>
            Sky Share is designed with your privacy in mind. We collect only
            the minimum data necessary to facilitate file transfers.
          </p>
          <h3 className="text-white font-medium text-base">What we store</h3>
          <ul className="list-disc list-inside space-y-1 text-[#999]">
            <li>Uploaded files are stored temporarily in encrypted cloud storage.</li>
            <li>Transfer metadata (file names, sizes, codes) is held in memory only.</li>
            <li>IP addresses may be temporarily logged for rate-limiting purposes.</li>
          </ul>
          <h3 className="text-white font-medium text-base">Auto-deletion</h3>
          <p>
            All files and associated metadata are automatically and permanently
            deleted after <span className="text-white">15 minutes</span>. We do not retain copies.
          </p>
          <h3 className="text-white font-medium text-base">No tracking</h3>
          <p>
            We do not use cookies, analytics trackers, or third-party advertising
            scripts. No accounts or personal information are required.
          </p>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal open={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Service">
        <div className="space-y-4 text-sm text-[#bbbbbb] leading-relaxed">
          <p>
            By using Sky Share, you agree to the following terms.
          </p>
          <h3 className="text-white font-medium text-base">Acceptable use</h3>
          <ul className="list-disc list-inside space-y-1 text-[#999]">
            <li>Do not upload illegal, harmful, or copyrighted content you do not own.</li>
            <li>Do not use the service for spam, phishing, or malware distribution.</li>
            <li>Do not attempt to brute-force transfer codes or abuse rate limits.</li>
          </ul>
          <h3 className="text-white font-medium text-base">Liability</h3>
          <p>
            Sky Share is provided <span className="text-white">"as is"</span> without
            warranties. We are not responsible for data loss, unauthorized access,
            or misuse of shared files.
          </p>
          <h3 className="text-white font-medium text-base">File limits</h3>
          <p>
            Maximum file size is <span className="text-white">50 MB</span> per file, up
            to <span className="text-white">5 files</span> per transfer. Transfers
            expire after <span className="text-white">15 minutes</span>.
          </p>
        </div>
      </Modal>

      {/* About Modal */}
      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} title="About Sky Share">
        <div className="space-y-4 text-sm text-[#bbbbbb] leading-relaxed">
          <p>
            <span className="text-white font-medium">Sky Share</span> is a premium,
            minimalistic file-sharing platform built for speed and simplicity.
          </p>
          <p>
            Upload files, get a 4-digit code, share it — that's it. No sign-ups,
            no accounts, no tracking. Your files are encrypted in cloud storage
            and auto-deleted after 15 minutes.
          </p>
          <h3 className="text-white font-medium text-base">Built with</h3>
          <ul className="list-disc list-inside space-y-1 text-[#999]">
            <li>React + Vite + Tailwind CSS</li>
            <li>Node.js + Express</li>
            <li>Cloudflare R2 (encrypted storage)</li>
            <li>Redis (transfer metadata)</li>
          </ul>
          <div className="border-t border-[#262626] pt-4 text-center">
            <p className="text-[#666] text-xs">
              Designed & developed by <span className="text-white">Akash K</span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
