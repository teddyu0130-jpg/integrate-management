import Link from 'next/link';
import { getItems } from '@/lib/data';
import ItemCard from '@/components/ItemCard';

export default async function ShoppingPage() {
  const items = await getItems();
  const buyList = items
    .filter((item) => item.stock_level === 'low' || item.stock_level === 'empty')
    .sort((a, b) => {
      const priority = { empty: 0, low: 1, ok: 2, full: 3 } as const;
      return priority[a.stock_level] - priority[b.stock_level];
    });

  return (
    <main>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-zinc-900">買い物リスト</h1>
        <p className="text-sm text-zinc-500">残量が少ない・切れているアイテム</p>
      </header>

      {buyList.length === 0 ? (
        <p className="px-4 py-8 text-sm text-zinc-400">補充が必要なアイテムはありません</p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {buyList.map((item) => (
            <li key={item.iri}>
              <ItemCard item={item} showLocation />
            </li>
          ))}
        </ul>
      )}

      <div className="px-4 py-4">
        <Link href="/home" className="text-sm text-zinc-500 underline">
          ← ホームに戻る
        </Link>
      </div>
    </main>
  );
}
