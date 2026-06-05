import { Shield, BadgeCheck, Fingerprint } from 'lucide-react';

const configs = {
  premium: {
    icon: Fingerprint,
    text: 'Premium Verified',
    className: 'bg-emerald-500/90 text-white'
  },
  basic: {
    icon: BadgeCheck,
    text: 'Verified',
    className: 'bg-blue-500/90 text-white'
  },
  none: {
    icon: Shield,
    text: 'Unverified',
    className: 'bg-slate-400/90 text-white'
  }
};

export default function VerificationBadge({ level }) {
  const config = configs[level] || configs.none;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${config.className}`}>
      <Icon size={12} />
      {config.text}
    </span>
  );
}
