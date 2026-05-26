'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { UnifiedRecord, StockLevel } from '@/types';
import ItemCard from '@/components/ItemCard';

const STOCK_PRIORITY: Record<StockLevel, number> = {
  empty: 0,
  low: 1,
  ok: 2,
  full: 3,
};

interface HomeViewToggleProps {
  items: UnifiedRecord[];
}

export default function HomeViewToggle({ items }: HomeViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') ?? 'find';

  function switchView(view: 'find' | 'replenish') {
    router.push(`/home?view=${view}`);
  }

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b border-zinc-200">
        <button
          onClick={() => switchView('find')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            currentView === 'find'
              ? 'border-b-2 border-zinc-900 text-zinc-900'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          探す（場所別）
        </button>
        <button
          onClick={() => switchView('replenish')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            currentView === 'replenish'
              ? 'border-b-2 border-zinc-900 text-zinc-900'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          補充（残量順）
        </button>
      </div>

      {/* Content */}
      {currentView === 'find' ? (
        <FindModeView items={items} />
      ) : (
        <ReplenishModeView items={items} />
      )}
    </div>
  );
}

function FindModeView({ items }: { items: UnifiedRecord[] }) {
  const groups = items.reduce<Record<string, UnifiedRecord[]>>((acc, item) => {
    if (!acc[item.location]) acc[item.location] = [];
    acc[item.location].push(item);
    return acc;
  }, {});

  const sortedLocations = Object.keys(groups).sort();

  return (
    <div className="divide-y divide-zinc-100">
      {sortedLocations.map((location) => (
        <section key={location}>
          <h2 className="sticky top-0 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {location}
            <span className="ml-2 font-normal text-zinc-400">
              {groups[location].length}件
            </span>
          </h2>
          <ul>
            {groups[location].map((item) => (
              <li key={item.iri}>
                <ItemCard item={item} showLocation={false} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ReplenishModeView({ items }: { items: UnifiedRecord[] }) {
  const sorted = [...items].sort(
    (a, b) => STOCK_PRIORITY[a.stock_level] - STOCK_PRIORITY[b.stock_level],
  );

  return (
    <ul className="divide-y divide-zinc-100">
      {sorted.map((item) => (
        <li key={item.iri}>
          <ItemCard item={item} showLocation />
        </li>
      ))}
    </ul>
  );
}
