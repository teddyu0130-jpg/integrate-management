import type { StockLevel } from '@/types';

const BADGE_STYLES: Record<StockLevel, string> = {
  empty: 'bg-missing text-missing-foreground',
  low: 'bg-warning text-warning-foreground',
  ok: 'bg-success text-success-foreground',
  full: 'bg-secondary text-muted-foreground',
};

const LABEL: Record<StockLevel, string> = {
  empty: '切れ',
  low: '残り少',
  ok: '良好',
  full: '十分',
};

export default function StockBadge({ level }: { level: StockLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${BADGE_STYLES[level]}`}
    >
      {LABEL[level]}
    </span>
  );
}
