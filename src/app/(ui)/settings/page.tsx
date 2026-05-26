import Link from 'next/link';

export default function SettingsPage() {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  return (
    <main className="px-4 pt-6 pb-4 space-y-6">
      <h1 className="text-xl font-bold text-zinc-900">設定</h1>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          アプリ情報
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">バージョン</dt>
            <dd className="text-zinc-900">0.1.0</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">接続モード</dt>
            <dd className={isMock ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>
              {isMock ? 'モック（静的データ）' : 'ライブ（実接続）'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Provider 接続先
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">App①（場所管理）</dt>
            <dd className="text-zinc-400 text-xs">実接続フェーズで設定</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">App②（在庫管理）</dt>
            <dd className="text-zinc-400 text-xs">実接続フェーズで設定</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          データ管理
        </h2>
        <Link
          href="/duplicates"
          className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3 text-sm hover:bg-zinc-50"
        >
          <span className="text-zinc-700">重複登録の検出</span>
          <span className="text-zinc-400">→</span>
        </Link>
      </section>
    </main>
  );
}
