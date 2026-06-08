'use client';

import { useRouter } from 'next/navigation';
import type { UnifiedRecord } from '@/types';
import { mergeItems } from '@/lib/actions';
import type { MergeGroup } from '@/lib/actions';

export default function MergeButton({ group }: { group: UnifiedRecord[] }) {
  const router = useRouter();

  async function handleMerge() {
    const loser = group.find((i) => i.iri.startsWith('iri://local.app2.stock/')) ?? group[1];
    const winner = group.find((i) => !i.iri.startsWith('iri://local.app2.stock/')) ?? group[0];
    const mergeGroup: MergeGroup = {
      winnerIri: winner.iri,
      loserIri: loser.iri,
      name: loser.name,
      category: loser.category,
      stockLevel: loser.stock_level,
      note: loser.note,
    };
    await mergeItems(mergeGroup);
    router.refresh();
  }

  return (
    <button
      onClick={handleMerge}
      className="w-full rounded-md border border-yellow-400 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
    >
      マージ（App①を残す）
    </button>
  );
}
