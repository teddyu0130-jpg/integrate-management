import { Suspense } from 'react';
import { getItems } from '@/lib/data';
import HomeViewToggle from '@/components/HomeViewToggle';

export default async function HomePage() {
  const items = await getItems();

  return (
    <main>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-zinc-900">家ものメイドくん</h1>
      </header>
      <Suspense fallback={<p className="px-4 py-8 text-sm text-zinc-400">読み込み中...</p>}>
        <HomeViewToggle items={items} />
      </Suspense>
    </main>
  );
}
