import type { LucideIcon } from 'lucide-react';

type KpiCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'sky' | 'emerald' | 'rose' | 'amber';
  hint?: string;
};

const accentMap = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-600/10' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-600/10' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-600/10' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-600/10' },
} as const;

export default function KpiCard({ label, value, icon: Icon, accent = 'sky', hint }: KpiCardProps) {
  const colors = accentMap[accent];
  return (
    <div className="card p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
