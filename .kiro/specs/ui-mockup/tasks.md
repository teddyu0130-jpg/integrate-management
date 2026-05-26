# Implementation Plan

- [x] 1. Foundation: 型定義とデータ基盤の構築

- [x] 1.1 UnifiedRecord / StockLevel 型定義
  - `src/types/index.ts` に `StockLevel`（`'full' | 'ok' | 'low' | 'empty'` リテラルユニオン）と `UnifiedRecord` インターフェースを定義する
  - `iri`・`name`・`category`・`location`・`stock_level`・`note`・`updated_at` の全フィールドを明示型で定義し、`any` を一切使用しない
  - `StockLevel` を名前付き export として公開し、全コンポーネントが同一型を参照できる状態にする
  - `tsconfig.json` の `strict: true` でコンパイルエラーが 0 件であることを確認する
  - `node_modules/next/dist/docs/` を参照し、Next.js 16.2.6 の型システム要件に準拠していることを確認する
  - _Requirements: 1.1, 11.4, 12.1, 12.2_

- [x] 1.2 静的モックデータの作成
  - `lib/mock-data.ts` に `UnifiedRecord[]` 型の `MOCK_ITEMS` を定義する
  - 最低 10 件、`stock_level` の全4値（`full`・`ok`・`low`・`empty`）それぞれが 1 件以上含まれること
  - 複数の `location` と複数の `category` を含め、グループ化・ソートの動作を確認できるデータにする
  - `name` が同一で `iri` が異なるレコードを最低 1 ペア含める（重複検出画面の動作確認用）
  - `MOCK_ITEMS` を import し、`stock_level: 'low'` または `'empty'` のレコードが 2 件以上あることを確認する
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 1.3 データアクセス層と engine stub の実装
  - `lib/ontology-engine.ts` stub を作成し、`getItems()` と `getItem(iri)` が `UnifiedRecord[]` / `null` を返す空実装を提供する
  - `lib/data.ts` に `getItems(): Promise<UnifiedRecord[]>` と `getItem(iri: string): Promise<UnifiedRecord | null>` を定義する
  - `process.env.NEXT_PUBLIC_USE_MOCK === 'true'` のとき `MOCK_ITEMS` を返し、それ以外のとき `ontology-engine.ts` を呼ぶ分岐を実装する
  - `.env.local.example` に `NEXT_PUBLIC_USE_MOCK=true` を追加し、切り替え方法を明示する
  - モックモード時に `lib/ontology-engine.ts` のネットワークパスが実行されないことを確認する（stub は throw または空配列を返すのみ）
  - _Requirements: 1.5, 1.6, 1.7, 11.3, 12.3, 12.5_

---

- [x] 2. Core: 共通 UI コンポーネントの実装

- [x] 2.1 (P) StockBadge — 残量状態カラーバッジ
  - `components/StockBadge.tsx` を Server Component として作成する
  - `level: StockLevel` を props として受け取り、`empty`→赤・`low`→黄・`ok`→緑・`full`→グレーのバッジを Tailwind CSS v4 で描画する
  - 全4値で正しいクラスが適用されることをブラウザで目視確認できる状態にする
  - _Requirements: 3.3, 4.3, 4.4_
  - _Boundary: StockBadge_

- [x] 2.2 (P) BottomNav — 共通ナビゲーション
  - `components/BottomNav.tsx` を `"use client"` で作成する
  - `usePathname` でアクティブパスを検出し、ホーム（`/home`）・買い物（`/shopping`）・設定（`/settings`）の 3 タブのうち現在のパスに対応するタブをアクティブ表示する
  - タブをクリックすると対応ルートへ遷移し、アクティブ状態が更新されることを確認する
  - _Requirements: 2.1, 2.2_
  - _Boundary: BottomNav_

- [x] 2.3 (P) ItemForm — 登録・編集共用フォーム
  - `components/ItemForm.tsx` を `"use client"` で作成する
  - `mode: 'create' | 'edit'` と `initialData?: Partial<UnifiedRecord>` を props として受け取り、`name`・`category`・`location`・`stock_level`（セレクト）・`note` の入力フォームを描画する
  - `name` が空のまま送信しようとしたとき、クライアント側でエラーメッセージを表示してフォーム送信をブロックする
  - 送信成功時（モック）に「登録しました（モック）」または「更新しました（モック）」のフィードバックを表示する
  - `mode === 'edit'` のとき `initialData` の値でフォームがプリフィルされることを確認する
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 12.4_
  - _Boundary: ItemForm_

- [x] 2.4 (P) HomeViewToggle — Find / Replenish / Duplicate モード切り替え
  - `components/HomeViewToggle.tsx` を `"use client"` で作成する
  - `items: UnifiedRecord[]` を props として受け取り、`useSearchParams` で `?view=find|replenish|duplicate` を読む
  - `view=find`（デフォルト）のとき `location` でグループ化した UnifiedItemCard リスト + SearchBar + ProviderStatusBar をレンダリングする
  - `view=replenish` のとき `stock_level` 優先度順（`empty`→`low`→`ok`→`full`）の RestockItemRow リストをレンダリングする
  - `view=duplicate` のとき items から重複ペアを検出し DuplicateAlertCard を表示する
  - タブボタンをクリックすると URL が `?view=find`・`?view=replenish`・`?view=duplicate` のいずれかに更新される
  - AppHeader（動的タイトル「探すモード」/「補充モード」/「重複検出」・更新ボタン）を内部に含む
  - _Requirements: 3.1, 3.2, 3.5, 4.1, 4.2, 4.5, 7.1, 7.2, 7.4_
  - _Boundary: HomeViewToggle_

- [x] 2.5 ItemCard — アイテム行表示コンポーネント
  - `components/ItemCard.tsx` を Server Component として作成する
  - `item: UnifiedRecord` と `showLocation?: boolean` を props として受け取り、`name`・`StockBadge`・`category`（・`location` が `showLocation=true` のとき）を表示する
  - `href` を `encodeURIComponent(item.iri)` で生成し、クリックで `/items/[iri]` へ遷移する Link を提供する
  - `StockBadge` を子コンポーネントとして使用し、`stock_level` に応じたバッジが表示されることを確認する
  - _Depends: 2.1_
  - _Requirements: 3.2, 3.4, 4.2, 6.2, 6.5_

---

- [x] 3. Core: 画面実装

- [x] 3.1 アプリシェル — レイアウトとルーティング結線
  - `src/app/layout.tsx` のメタデータを「家ものメイドくん（App③）」に更新し、Geist フォント変数（`--font-geist-sans`・`--font-geist-mono`）が全画面に適用されることを確認する
  - `src/app/(ui)/layout.tsx` を作成し、`BottomNav` をマウントして全 (ui) 配下のページで共通ナビゲーションが表示される状態にする
  - `src/app/page.tsx` を `/home` へのリダイレクト（`redirect('/home')`）に置き換える
  - `/` にアクセスすると `/home` へリダイレクトされ、BottomNav が表示されることをブラウザで確認する
  - _Requirements: 2.1, 2.3, 2.4, 11.4_

- [x] 3.2 (P) I-01 / I-02 ホーム画面（Find Mode・Replenish Mode）
  - `src/app/(ui)/home/page.tsx` を Server Component として作成し、`getItems()` からデータを取得して `HomeViewToggle` に渡す
  - `?view=find`（デフォルト）では `location` ごとのグループヘッダー（location 名 + 件数）と `ItemCard` リストが表示される
  - `?view=replenish` では `stock_level` 優先度順の `ItemCard` リストが表示され、各行に `location` が表示される
  - Find / Replenish タブを切り替えると URL と表示が切り替わることをブラウザで確認する
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5_
  - _Boundary: home/page.tsx, HomeViewToggle_

- [x] 3.3 (P) I-03 アイテム詳細画面
  - `src/app/(ui)/items/[iri]/page.tsx` を Server Component として作成し、`params.iri`（`decodeURIComponent` 処理済み）で `getItem()` を呼ぶ
  - `name`・`category`・`location`・`stock_level`（StockBadge）・`note`・`updated_at` を全て表示する
  - 編集ページ（`/items/[iri]/edit`）へのボタンと、モック削除確認ダイアログ（クリックで「実接続フェーズで実装予定」表示）を提供する
  - `iri` が存在しないとき「アイテムが見つかりません」メッセージと戻りリンクを表示することを確認する
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Boundary: items/[iri]/page.tsx_

- [x] 3.4 (P) I-04 買い物リスト画面
  - `src/app/(ui)/shopping/page.tsx` を Server Component として作成し、`getItems()` から `stock_level === 'low' || 'empty'` のレコードのみ抽出する
  - `empty` を `low` より先に表示し、各行に `name`・`StockBadge`・`location`（戻し場所）を表示する
  - 該当アイテムが 0 件のとき「補充が必要なアイテムはありません」メッセージを表示する
  - MOCK_ITEMS に `low`/`empty` アイテムが存在し、それらのみが `/shopping` に表示されることをブラウザで確認する
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - _Boundary: shopping/page.tsx_

- [x] 3.5 (P) I-05 重複登録検出画面
  - `src/app/(ui)/duplicates/page.tsx` を Server Component として作成し、`getItems()` から `name` 一致・`iri` 不一致のペアを全て抽出するロジックを実装する
  - 各ペアに衝突 `iri`・各レコードの `location`・`stock_level` を並べて表示する
  - 各ペアに「マージ」ボタンを表示し、クリック時に「実接続フェーズで実装予定」トーストまたはダイアログを表示する
  - 重複ペアが 0 件のとき「重複登録は検出されませんでした」メッセージを表示する
  - MOCK_ITEMS の重複ペアが検出されて画面に表示されることをブラウザで確認する
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - _Boundary: duplicates/page.tsx_

- [x] 3.6 (P) I-06 新規登録画面
  - `src/app/(ui)/items/new/page.tsx` を作成し、`mode="create"` で `ItemForm` をマウントする
  - `ItemForm` の `name` 空送信でエラーメッセージが表示されることをブラウザで確認する
  - フォーム送信時に「登録しました（モック）」フィードバックが表示されホーム画面に遷移することを確認する
  - _Depends: 2.3_
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - _Boundary: items/new/page.tsx_

- [x] 3.7 (P) I-07 編集画面
  - `src/app/(ui)/items/[iri]/edit/page.tsx` を作成し、`getItem(iri)` の返値を `initialData` として `mode="edit"` で `ItemForm` をマウントする
  - フォームが既存レコードの値でプリフィルされることをブラウザで確認する
  - フォーム送信時に「更新しました（モック）」フィードバックが表示され詳細画面に遷移することを確認する
  - `iri` 不一致のとき `ItemForm` を表示せずエラーメッセージと戻りリンクを表示することを確認する
  - _Depends: 2.3_
  - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - _Boundary: items/[iri]/edit/page.tsx_

- [x] 3.8 (P) I-08 設定画面
  - `src/app/(ui)/settings/page.tsx` を作成し、アプリバージョン・現在の接続モード（mock / live）・Provider URL プレースホルダーを表示する
  - I-05 重複検出（`/duplicates`）へのリンクを含める
  - 認証・ログアウト UI は一切表示しない
  - `/settings` にアクセスして上記 3 項目が表示されることをブラウザで確認する
  - _Requirements: 10.1, 10.2, 10.3_
  - _Boundary: settings/page.tsx_

---

- [x] 4. Validation: ビルド・型・lint 全検証
  - `.env.local` に `NEXT_PUBLIC_USE_MOCK=true` を設定し、`npm run dev` でモックモードが動作することをブラウザで確認する
  - `npm run lint` がエラー・警告ゼロで完了することを確認する
  - `npm run build` がエラーゼロで完了することを確認する
  - TypeScript の strict コンパイルエラーが 0 件であることを確認する（`any` 使用がないこと）
  - モックモード時にブラウザの Network タブで Provider への外部リクエストが発生していないことを確認する
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.5_
