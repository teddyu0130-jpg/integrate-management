import Link from 'next/link';
import { getItems } from '@/lib/data';
import StockBadge from '@/components/StockBadge';

export const dynamic = 'force-dynamic';

export default async function ShoppingPage() {
  const items = await getItems();
  const buyList = items
    .filter((item) => item.stock_level === 'low' || item.stock_level === 'empty')
    .sort((a, b) => {
      const priority: Record<string, number> = { empty: 0, low: 1, half: 2, ok: 2, full: 3 };
      return priority[a.stock_level] - priority[b.stock_level];
    });

  return (
    <main>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-foreground">買い物リスト</h1>
        <p className="text-sm text-muted-foreground">残量が少ない・切れているアイテム</p>
      </header>

      {buyList.length === 0 ? (
        <p className="px-4 py-8 text-sm text-muted-foreground">補充が必要なアイテムはありません</p>
      ) : (
        <ul className="flex flex-col gap-3 px-4 pt-3">
          {buyList.map((item) => (
            <li
              key={item.iri}
              className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 h-[72px]"
            >
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-base font-semibold text-foreground">{item.name}</span>
                <span className="text-[13px] text-muted-foreground">{item.location}</span>
              </div>
              <StockBadge level={item.stock_level} />
            </li>
          ))}
        </ul>
      )}

      <div className="px-4 py-4">
        <Link href="/home" className="text-sm text-muted-foreground underline">
          ← ホームに戻る
        </Link>
      </div>
    </main>
  );
}
