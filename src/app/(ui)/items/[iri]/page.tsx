import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getItem } from '@/lib/data';
import type { StockLevel } from '@/types';

const STOCK_LABEL: Record<StockLevel, string> = {
  empty: '切れ',
  low: '残り少',
  ok: '良好',
  full: '十分',
};

const STOCK_BADGE_STYLE: Record<StockLevel, string> = {
  empty: 'bg-missing text-missing-foreground',
  low: 'bg-warning text-warning-foreground',
  ok: 'bg-success text-success-foreground',
  full: 'bg-secondary text-muted-foreground',
};

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
    <div className="flex flex-col bg-background min-h-screen">
      {/* ScreenNav */}
      <div className="flex items-center gap-3 px-4 h-14">
        <Link href="/home" aria-label="戻る">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-foreground">{item.name}</h1>
      </div>

      {/* ProviderStatusBar */}
      <div className="mx-4 h-9 flex items-center gap-2 rounded-lg bg-warning px-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warning-foreground shrink-0"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        <span className="text-[13px] text-warning-foreground flex-1">
          App② から一部属性を取得できません
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        {/* UnifiedItemCard */}
        <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-bold text-foreground">{item.name}</span>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${STOCK_BADGE_STYLE[item.stock_level]}`}
            >
              {STOCK_LABEL[item.stock_level]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground shrink-0"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm text-muted-foreground">{item.location}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-info text-info-foreground">
              App①
            </span>
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-info text-info-foreground">
              App②
            </span>
          </div>
        </div>

        {/* MissingAttributeBlock — IRI */}
        <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">IRI</span>
          <span className="text-[13px] text-foreground font-mono break-all">{item.iri}</span>
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-missing text-missing-foreground w-fit">
            消費予測: 未取得
          </span>
        </div>

        {/* MissingAttributeBlock — 消費予測 */}
        <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">消費予測</span>
          <span className="text-[13px] text-foreground">—</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/items/${encodeURIComponent(item.iri)}/edit`}
            className="flex h-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-base font-semibold"
          >
            Provider で編集
          </Link>
          <Link
            href="/home"
            className="flex h-12 items-center justify-center rounded-xl bg-card border border-border text-foreground text-base font-semibold"
          >
            戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
