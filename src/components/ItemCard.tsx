import Link from 'next/link';
import type { UnifiedRecord } from '@/types';
import StockBadge from '@/components/StockBadge';

interface ItemCardProps {
  item: UnifiedRecord;
  showLocation?: boolean;
}

export default function ItemCard({ item, showLocation = false }: ItemCardProps) {
  return (
    <Link
      href={`/items/${encodeURIComponent(item.iri)}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
        <p className="text-xs text-zinc-400">
          {item.category}
          {showLocation && item.location && ` · ${item.location}`}
        </p>
      </div>
      <StockBadge level={item.stock_level} />
    </Link>
  );
}
