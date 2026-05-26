import Link from 'next/link';

export default function ItemNotFound() {
  return (
    <main className="px-4 pt-6 space-y-4">
      <p className="text-sm text-zinc-500">アイテムが見つかりません</p>
      <Link href="/home" className="text-sm text-zinc-500 underline">
        ← ホームに戻る
      </Link>
    </main>
  );
}
