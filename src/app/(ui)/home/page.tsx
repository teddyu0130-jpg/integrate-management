import { Suspense } from 'react';
import { getItems } from '@/lib/data';
import HomeViewToggle from '@/components/HomeViewToggle';

export default async function HomePage() {
  const items = await getItems();

  return (
    <main>
      <Suspense fallback={<p className="px-4 py-8 text-sm text-muted-foreground">読み込み中...</p>}>
        <HomeViewToggle items={items} />
      </Suspense>
    </main>
  );
}
