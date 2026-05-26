import Link from 'next/link';
import ItemForm from '@/components/ItemForm';

export default function NewItemPage() {
  return (
    <main className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/home" className="text-sm text-zinc-500">
          ← 戻る
        </Link>
      </div>
      <h1 className="text-xl font-bold text-zinc-900">アイテムを登録</h1>
      <ItemForm mode="create" />
    </main>
  );
}
