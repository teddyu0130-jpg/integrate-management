import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '@/lib/data';
import StockBadge from '@/components/StockBadge';
import DeleteButton from './DeleteButton';

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ iri: string }>;
}) {
  const { iri } = await params;
  const item = await getItem(decodeURIComponent(iri));

  if (!item) {
    notFound();
  }

  return (
    <main className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/home" className="text-sm text-zinc-500">
          ← 戻る
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900">{item.name}</h1>
        <StockBadge level={item.stock_level} />
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">カテゴリ</dt>
          <dd className="mt-0.5 text-zinc-900">{item.category || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">収納場所</dt>
          <dd className="mt-0.5 text-zinc-900">{item.location || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">メモ</dt>
          <dd className="mt-0.5 text-zinc-900">{item.note || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">最終更新</dt>
          <dd className="mt-0.5 text-zinc-500">
            {new Date(item.updated_at).toLocaleString('ja-JP')}
          </dd>
        </div>
      </dl>

      <div className="flex gap-3 pt-2">
        <Link
          href={`/items/${encodeURIComponent(item.iri)}/edit`}
          className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          編集
        </Link>
        <DeleteButton />
      </div>
    </main>
  );
}
