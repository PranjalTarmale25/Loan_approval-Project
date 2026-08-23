type StatusBadgeProps = {
  status: 'approved' | 'rejected' | 'pending' | 'review';
  className?: string;
};

const statusConfig = {
  approved: {
    label: 'Approved',
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    classes: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
    dot: 'bg-rose-500',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  review: {
    label: 'Under Review',
    classes: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20',
    dot: 'bg-sky-500',
  },
} as const;

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.classes} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
