import { useEffect } from 'react';
import { Megaphone, ExternalLink, Sparkles } from 'lucide-react';

export default function AdBanner({ onContactSponsor }) {
  const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const adsenseSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (adsenseClientId && adsenseSlotId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        /* AdSense script not ready or ad blocked */
      }
    }
  }, [adsenseClientId, adsenseSlotId]);

  // If real Google AdSense is configured, render the AdSense slot
  if (adsenseClientId && adsenseSlotId) {
    return (
      <div className="w-full my-8 text-center overflow-hidden">
        <span className="text-[10px] text-[#555] uppercase tracking-widest block mb-1">Advertisement</span>
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={adsenseClientId}
          data-ad-slot={adsenseSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Default: Sleek "WeTransfer-style" Direct Sponsorship Banner
  return (
    <div className="w-full my-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121212] via-[#161616] to-[#121212] border border-[#262626] hover:border-[#383838] transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-[#22C55E]" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
              Sponsor Spot
            </span>
            <span className="text-xs text-[#666]">Reach students & creators</span>
          </div>
          <p className="text-sm font-medium text-white mt-0.5">
            Promote your college fest, tech event, or startup on Sky Share
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/918792284825?text=Hi%20Akash,%20I%20want%20to%20advertise/sponsor%20on%20Sky%20Share!"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 text-xs font-semibold transition-colors"
      >
        <span>Book Banner</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
