import type { StockLevel } from '@/types';

const BADGE_STYLES: Record<StockLevel, string> = {
  empty: 'bg-red-100 text-red-700',
  low: 'bg-yellow-100 text-yellow-700',
  ok: 'bg-green-100 text-green-700',
  full: 'bg-zinc-100 text-zinc-500',
};

const LABEL: Record<StockLevel, string> = {
  empty: '切れ',
  low: '残少',
  ok: '良好',
  full: '満タン',
};

export default function StockBadge({ level }: { level: StockLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[level]}`}
    >
      {LABEL[level]}
    </span>
  );
}
