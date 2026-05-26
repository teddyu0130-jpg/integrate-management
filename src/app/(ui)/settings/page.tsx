import Link from 'next/link';

export default function SettingsPage() {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  return (
    <main className="px-4 pt-6 pb-4 space-y-6">
      <h1 className="text-xl font-bold text-foreground">設定</h1>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          アプリ情報
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">バージョン</dt>
            <dd className="text-foreground">0.1.0</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">接続モード</dt>
            <dd
              className={
                isMock
                  ? 'text-warning-foreground font-medium'
                  : 'text-success-foreground font-medium'
              }
            >
              {isMock ? 'モック（静的データ）' : 'ライブ（実接続）'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Provider 接続先
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">App①（場所管理）</dt>
            <dd className="text-muted-foreground text-xs">実接続フェーズで設定</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">App②（在庫管理）</dt>
            <dd className="text-muted-foreground text-xs">実接続フェーズで設定</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          データ管理
        </h2>
        <Link
          href="/duplicates"
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm hover:bg-secondary transition-colors"
        >
          <span className="text-foreground">重複登録の検出</span>
          <span className="text-muted-foreground">→</span>
        </Link>
      </section>
    </main>
  );
}
