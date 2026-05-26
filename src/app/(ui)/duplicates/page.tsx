import Link from 'next/link';
import { getItems } from '@/lib/data';
import type { UnifiedRecord } from '@/types';
import StockBadge from '@/components/StockBadge';
import MergeButton from './MergeButton';

function findDuplicates(items: UnifiedRecord[]): UnifiedRecord[][] {
  const nameGroups = items.reduce<Record<string, UnifiedRecord[]>>((acc, item) => {
    if (!acc[item.name]) acc[item.name] = [];
    acc[item.name].push(item);
    return acc;
  }, {});

  return Object.values(nameGroups).filter((group) => group.length > 1);
}

export default async function DuplicatesPage() {
  const items = await getItems();
  const duplicateGroups = findDuplicates(items);

  return (
    <main className="px-4 pt-6 pb-4 space-y-4">
      <div>
        <Link href="/settings" className="text-sm text-zinc-500">
          ← 設定に戻る
        </Link>
      </div>
      <h1 className="text-xl font-bold text-zinc-900">重複登録の検出</h1>
      <p className="text-sm text-zinc-500">
        同じ名前で異なる IRI を持つアイテムを一覧表示します
      </p>

      {duplicateGroups.length === 0 ? (
        <p className="py-8 text-sm text-zinc-400">重複登録は検出されませんでした</p>
      ) : (
        <ul className="space-y-4">
          {duplicateGroups.map((group) => (
            <li
              key={group[0].name}
              className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 space-y-3"
            >
              <p className="font-semibold text-zinc-900">「{group[0].name}」が重複しています</p>
              <ul className="space-y-2">
                {group.map((item) => (
                  <li
                    key={item.iri}
                    className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs text-zinc-400">{item.iri}</p>
                      <p className="text-zinc-700">{item.location}</p>
                    </div>
                    <StockBadge level={item.stock_level} />
                  </li>
                ))}
              </ul>
              <MergeButton name={group[0].name} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
