'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { UnifiedRecord, StockLevel } from '@/types';

const STOCK_PRIORITY: Record<StockLevel, number> = {
  empty: 0,
  low: 1,
  ok: 2,
  full: 3,
};

const STOCK_LABEL: Record<StockLevel, string> = {
  empty: '切れ',
  low: '残り少',
  ok: '良好',
  full: '十分',
};

const STOCK_BADGE_STYLE: Record<StockLevel, string> = {
  empty: 'bg-missing text-missing-foreground',
  low: 'bg-warning text-warning-foreground',
  ok: 'bg-success text-success-foreground',
  full: 'bg-secondary text-muted-foreground',
};

type View = 'find' | 'replenish' | 'duplicate';

const VIEW_TITLES: Record<View, string> = {
  find: '探すモード',
  replenish: '補充モード',
  duplicate: '重複検出',
};

const TABS: { key: View; label: string }[] = [
  { key: 'find', label: '探す' },
  { key: 'replenish', label: '補充' },
  { key: 'duplicate', label: '重複' },
];

interface HomeViewToggleProps {
  items: UnifiedRecord[];
}

export default function HomeViewToggle({ items }: HomeViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = (searchParams.get('view') as View) ?? 'find';

  function switchView(view: View) {
    router.push(`/home?view=${view}`);
  }

  return (
    <div className="flex flex-col">
      {/* AppHeader */}
      <div className="flex items-center justify-between px-4 h-14">
        <span className="text-[20px] font-bold text-foreground">{VIEW_TITLES[currentView]}</span>
        <button
          onClick={() => router.refresh()}
          className="h-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-base font-semibold px-4"
        >
          更新
        </button>
      </div>

      {/* ModeTabs */}
      <div className="flex gap-2 px-4 h-11 items-center">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchView(tab.key)}
            className={`h-9 rounded-full px-3.5 text-sm transition-colors ${
              currentView === tab.key
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'bg-secondary text-foreground font-medium'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SearchBar — find mode only */}
      {currentView === 'find' && (
        <div className="mx-4 mt-1 h-11 flex items-center gap-2 rounded-xl bg-card border border-border px-3">
          <IconSearch className="text-muted-foreground shrink-0" />
          <span className="text-[15px] text-muted-foreground">アイテム名で検索...</span>
        </div>
      )}

      {/* ProviderStatusBar */}
      {currentView !== 'duplicate' && (
        <div className="mx-4 mt-2 h-9 flex items-center gap-2 rounded-lg bg-warning px-4">
          <IconAlert className="text-warning-foreground shrink-0" />
          <span className="text-[13px] text-warning-foreground flex-1">
            App② から一部属性を取得できません
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 py-3">
        {currentView === 'find' && <FindModeView items={items} />}
        {currentView === 'replenish' && <ReplenishModeView items={items} />}
        {currentView === 'duplicate' && <DuplicateView items={items} />}
      </div>
    </div>
  );
}

function LocationGroupHeader({ location }: { location: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 h-10">
      <IconMapPin className="text-primary shrink-0" size={18} />
      <span className="text-base font-bold text-foreground">{location}</span>
    </div>
  );
}

function UnifiedItemCard({ item }: { item: UnifiedRecord }) {
  return (
    <Link
      href={`/items/${encodeURIComponent(item.iri)}`}
      className="block rounded-xl bg-card border border-border p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[17px] font-bold text-foreground">{item.name}</span>
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${STOCK_BADGE_STYLE[item.stock_level]}`}
        >
          {STOCK_LABEL[item.stock_level]}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <IconMapPin className="text-muted-foreground shrink-0" size={16} />
        <span className="text-sm text-muted-foreground">{item.location}</span>
      </div>
      <div className="flex gap-1.5">
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-info text-info-foreground">
          App①
        </span>
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-info text-info-foreground">
          App②
        </span>
      </div>
    </Link>
  );
}

function RestockItemRow({ item }: { item: UnifiedRecord }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 h-[72px]">
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-base font-semibold text-foreground">{item.name}</span>
        <span className="text-[13px] text-muted-foreground">{item.location}</span>
      </div>
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-warning text-warning-foreground">
        要補充
      </span>
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
    <>
      {sortedLocations.map((location) => (
        <div key={location} className="flex flex-col gap-3">
          <LocationGroupHeader location={location} />
          {groups[location].map((item) => (
            <UnifiedItemCard key={item.iri} item={item} />
          ))}
        </div>
      ))}
    </>
  );
}

function ReplenishModeView({ items }: { items: UnifiedRecord[] }) {
  const needsRestock = [...items]
    .filter((i) => i.stock_level === 'empty' || i.stock_level === 'low')
    .sort((a, b) => STOCK_PRIORITY[a.stock_level] - STOCK_PRIORITY[b.stock_level]);

  const groups = needsRestock.reduce<Record<string, UnifiedRecord[]>>((acc, item) => {
    if (!acc[item.location]) acc[item.location] = [];
    acc[item.location].push(item);
    return acc;
  }, {});

  const locations = Object.keys(groups);

  if (locations.length === 0) {
    return <EmptyState title="補充が必要なアイテムはありません" />;
  }

  return (
    <>
      {locations.map((location) => (
        <div key={location} className="flex flex-col gap-3">
          <LocationGroupHeader location={`お使い: ${location}`} />
          {groups[location].map((item) => (
            <RestockItemRow key={item.iri} item={item} />
          ))}
        </div>
      ))}
    </>
  );
}

function findDuplicates(items: UnifiedRecord[]): UnifiedRecord[][] {
  const nameGroups = items.reduce<Record<string, UnifiedRecord[]>>((acc, item) => {
    if (!acc[item.name]) acc[item.name] = [];
    acc[item.name].push(item);
    return acc;
  }, {});
  return Object.values(nameGroups).filter((group) => group.length > 1);
}

function DuplicateAlertCard({ group }: { group: UnifiedRecord[] }) {
  const name = group[0].name;
  const detail = group
    .map((i, idx) => `App${['①', '②', '③'][idx] ?? idx + 1} (${i.location})`)
    .join(' と ');

  return (
    <div className="rounded-xl bg-warning border border-border p-4 flex flex-col gap-2">
      <span className="text-[15px] font-bold text-warning-foreground">重複登録の可能性</span>
      <span className="text-base font-semibold text-foreground">{name}</span>
      <span className="text-[13px] text-muted-foreground">{detail} に同一名で登録</span>
    </div>
  );
}

function DuplicateView({ items }: { items: UnifiedRecord[] }) {
  const groups = findDuplicates(items);

  return (
    <>
      {groups.map((group) => (
        <DuplicateAlertCard key={group[0].name} group={group} />
      ))}
      <EmptyState title="他に重複はありません" showHint={false} />
    </>
  );
}

function EmptyState({
  title,
  showHint = true,
}: {
  title: string;
  showHint?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <IconPackage className="text-muted-foreground" />
      <span className="text-base font-semibold text-foreground">{title}</span>
      {showHint && (
        <span className="text-sm text-muted-foreground text-center max-w-[280px]">
          検索条件を変更するか、Provider の接続を確認してください
        </span>
      )}
    </div>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconMapPin({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPackage({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05" />
      <line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  );
}
