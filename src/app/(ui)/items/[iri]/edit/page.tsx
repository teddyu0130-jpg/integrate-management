import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '@/lib/data';
import ItemForm from '@/components/ItemForm';

export default async function EditItemPage({
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
        <Link
          href={`/items/${encodeURIComponent(item.iri)}`}
          className="text-sm text-zinc-500"
        >
          ← 戻る
        </Link>
      </div>
      <h1 className="text-xl font-bold text-zinc-900">アイテムを編集</h1>
      <ItemForm mode="edit" initialData={item} />
    </main>
  );
}
