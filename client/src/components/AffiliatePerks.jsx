import { ExternalLink, Cloud, Shield, Terminal, BookOpen, Gift } from 'lucide-react';

const PERKS = [
  {
    title: 'Cloudflare Zero Trust',
    tag: 'Free Security',
    desc: 'Protect your apps and browse securely with Cloudflare DNS & Tunneling.',
    link: 'https://www.cloudflare.com/',
    icon: Cloud,
  },
  {
    title: 'GitHub Student Pack',
    tag: '$200k+ Free Tools',
    desc: 'Free GitHub Copilot, domains, Canva Pro, and cloud credits for students.',
    link: 'https://education.github.com/pack',
    icon: Gift,
  },
  {
    title: 'DigitalOcean Cloud',
    tag: '$200 Free Credit',
    desc: 'Deploy fast Linux servers, Docker containers, and databases easily.',
    link: 'https://m.do.co/c/affiliate-code', // Placeholder for user's referral code
    icon: Terminal,
  },
  {
    title: 'Proton VPN & Mail',
    tag: '100% Privacy',
    desc: 'Encrypted email and Swiss-based VPN with unlimited free bandwidth.',
    link: 'https://proton.me/',
    icon: Shield,
  },
];

export default function AffiliatePerks() {
  return (
    <div className="w-full mt-12 pt-10 border-t border-[#1c1c1c]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#22C55E] font-semibold">
            Community Perks
          </span>
          <h3 className="text-base font-semibold text-white mt-0.5">
            Recommended Tools for Students & Developers
          </h3>
        </div>
        <span className="text-[11px] text-[#666] hidden sm:block">
          Hand-picked resources
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <a
              key={perk.title}
              href={perk.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222222] hover:border-[#383838] hover:bg-[#121212] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-[#181818] border border-[#2a2a2a] text-[#888] group-hover:text-[#22C55E] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                    {perk.tag}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-[#22C55E] transition-colors">
                  {perk.title}
                </h4>
                <p className="text-xs text-[#777] mt-1 leading-relaxed">
                  {perk.desc}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#555] group-hover:text-white transition-colors mt-3 pt-2 border-t border-[#1a1a1a]">
                <span>Visit tool</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
