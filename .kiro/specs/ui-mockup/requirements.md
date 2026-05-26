# Requirements Document

## Introduction
integrate-management（App③）のモックアップフェーズ要件定義。実接続前に UI/UX を検証・確定することを目的とし、UnifiedRecord 型と同形の静的モックデータを用いて I-01〜I-08 の全8画面 UI を実装する。認証なし、Vercel デプロイ。

## Boundary Context
- **In scope**: 全8画面の UI 実装・UnifiedRecord 型定義・静的モックデータ（`lib/mock-data.ts`）・環境変数による接続切り替え構造・Vercel デプロイ設定
- **Out of scope**: App①・App② への実 API 接続・認証認可・`lib/ontology-engine.ts` の実ロジック・`ontologies/*.yaml` の実運用・消費ペース予測（`days_remaining`）・重複マージ操作の実行
- **Adjacent expectations**: 実接続フェーズでは `lib/mock-data.ts` を `lib/ontology-engine.ts` の呼び出しに差し替えることで同一 UI が動作することを設計上保証する

---

## Requirements

### Requirement 1: UnifiedRecord 型とモックデータ基盤

**Objective:** As a 開発者, I want UnifiedRecord 型と静的モックデータを一箇所に定義したい, so that 全画面が同一データ構造を参照でき、実接続への切り替えが環境変数 1 つで完結する

#### Acceptance Criteria
1. The App③ shall define `UnifiedRecord` 型を `src/types/index.ts`（または同等のパス）に持ち、フィールド `iri: string`・`name: string`・`category: string`・`location: string`・`stock_level: 'full' | 'ok' | 'low' | 'empty'`・`note: string`・`updated_at: string` をすべて含む
2. The App③ shall `lib/mock-data.ts` に `UnifiedRecord[]` 型の静的モックデータ（最低 10 件、`stock_level` の全4値を含む）を定義する
3. The App③ shall モックデータに複数の `category`・複数の `location` を含め、グループ化・フィルタリングの動作確認を可能にする
4. The App③ shall モックデータに `name` が一致し `iri` が異なるレコードを最低 1 ペア含め、重複検出画面の動作確認を可能にする
5. When 環境変数 `NEXT_PUBLIC_USE_MOCK` が `"true"` のとき, the App③ shall `lib/mock-data.ts` のデータを使用する
6. When 環境変数 `NEXT_PUBLIC_USE_MOCK` が `"false"` または未設定のとき, the App③ shall `lib/ontology-engine.ts` のデータ取得関数を呼び出す（モックアップ段階では stub で可）
7. The App③ shall `lib/mock-data.ts` 内にモックデータをハードコードし、コンポーネント内には一切含めない

---

### Requirement 2: 共通レイアウトとナビゲーション

**Objective:** As a ユーザー, I want 全画面で一貫したナビゲーションを使いたい, so that 8画面間をストレスなく移動できる

#### Acceptance Criteria
1. The App③ shall 全画面共通のボトムナビゲーション（またはヘッダーナビ）を持ち、探すモード（I-01）・補充モード（I-02）・買い物リスト（I-04）・設定（I-08）への直接遷移を提供する
2. When ナビゲーション項目をタップしたとき, the App③ shall 対応する画面に遷移し、アクティブ状態を視覚的に示す
3. The App③ shall Tailwind CSS v4 を使用し、モバイルファーストのレスポンシブレイアウトで全画面を実装する
4. The App③ shall `next/font/google` 経由で Geist Sans / Geist Mono を読み込み、CSS 変数 `--font-geist-sans`・`--font-geist-mono` として全画面に適用する
5. The App③ shall TypeScript strict モードを有効にし、`any` を使用しない

---

### Requirement 3: I-01 探すモード（Find Mode）

**Objective:** As a 夫, I want アイテムを収納場所のグループ別に見たい, so that 「シャンプーはどこにある？」をすぐ答えられる

#### Acceptance Criteria
1. When I-01 画面を表示したとき, the App③ shall `lib/mock-data.ts` の全 `UnifiedRecord` を `location` でグループ化して表示する
2. The App③ shall 各グループのヘッダーに `location` 名と、そのグループのアイテム件数を表示する
3. The App③ shall 各アイテム行に `name`・`stock_level`（視覚的バッジ）・`category` を表示する
4. When アイテム行をタップしたとき, the App③ shall I-03 アイテム詳細画面（`/items/[iri]`）に遷移する
5. The App③ shall `location` のアルファベット順または任意の安定した順序でグループを並べる

---

### Requirement 4: I-02 補充モード（Replenish Mode）

**Objective:** As a 妻, I want アイテムを残量の少ない順に見たい, so that 補充すべきものを一目で把握できる

#### Acceptance Criteria
1. When I-02 画面を表示したとき, the App③ shall `lib/mock-data.ts` の全 `UnifiedRecord` を `stock_level` の優先度順（`empty` → `low` → `ok` → `full`）で並べて表示する
2. The App③ shall 各アイテム行に `name`・`stock_level`（視覚的バッジ）・`location`・`category` を表示する
3. The App③ shall `stock_level` に応じて行またはバッジの色を変化させる（例：`empty` = 赤、`low` = 黄、`ok` = 緑、`full` = グレー）
4. When アイテム行をタップしたとき, the App③ shall I-03 アイテム詳細画面（`/items/[iri]`）に遷移する
5. The App③ shall I-01・I-02・I-05（重複検出）を同一ホーム画面（`/home`）内の3タブ切り替え（`?view=find|replenish|duplicate`）で実装する

---

### Requirement 5: I-03 アイテム詳細画面

**Objective:** As a ユーザー, I want アイテムの全属性を確認したい, so that 場所・残量・メモを一箇所で把握できる

#### Acceptance Criteria
1. When `/items/[iri]` に遷移したとき, the App③ shall `iri` に一致するモックレコードの `name`・`category`・`location`・`stock_level`・`note`・`updated_at` を全て表示する
2. The App③ shall 詳細画面から I-07 編集画面（`/items/[iri]/edit`）への遷移ボタンを提供する
3. The App③ shall 詳細画面から削除操作のモック UI（確認ダイアログ付き）を提供する（モックアップ段階では実際の削除処理は行わない）
4. If 指定された `iri` に一致するレコードがモックデータに存在しないとき, the App③ shall 「アイテムが見つかりません」旨のメッセージと前画面への戻りリンクを表示する
5. The App③ shall ページ上部に前画面へ戻るナビゲーション（Back ボタンまたはパンくず）を提供する

---

### Requirement 6: I-04 買い物リスト画面

**Objective:** As a 妻, I want 残量が少ない・切れているアイテムを収納場所付きで一覧したい, so that 買い物時に何をどこへ戻すかわかる買い物リストを作れる

#### Acceptance Criteria
1. When `/shopping` に遷移したとき, the App③ shall `lib/mock-data.ts` から `stock_level` が `'low'` または `'empty'` のレコードだけを抽出して表示する
2. The App③ shall 各行に `name`・`stock_level`・`location`（戻し場所）を表示する
3. The App③ shall `empty` のアイテムを `low` より先に表示する
4. While 該当アイテムが 0 件のとき, the App③ shall 「補充が必要なアイテムはありません」旨のメッセージを表示する
5. When アイテム行をタップしたとき, the App③ shall I-03 アイテム詳細画面に遷移する

---

### Requirement 7: I-05 重複登録検出画面

**Objective:** As a ユーザー, I want 統合ビュー上で重複登録を確認したい, so that 同一物が複数の Provider に別々に登録されていることに気づける

#### Acceptance Criteria
1. When `/duplicates`（または設定画面内のセクション）に遷移したとき, the App③ shall モックデータから `name` が一致し `iri` が異なるレコードのペアを全て列挙する
2. The App③ shall 各重複ペアに、衝突している `iri`・各レコードの `location`・`stock_level` を並べて表示する
3. The App③ shall 各ペアに「マージ」ボタンを表示するが、モックアップ段階ではクリック時に「実接続フェーズで実装予定」トーストまたはダイアログを表示する
4. While 重複ペアが 0 件のとき, the App③ shall 「重複登録は検出されませんでした」旨のメッセージを表示する

---

### Requirement 8: I-06 新規登録画面

**Objective:** As a ユーザー, I want アイテムを新規登録したい, so that 統合管理に新しいアイテムを追加できる

#### Acceptance Criteria
1. When `/items/new` に遷移したとき, the App③ shall `name`・`category`・`location`・`stock_level`（セレクト）・`note` の入力フォームを表示する
2. The App③ shall `name` を必須フィールドとし、未入力のまま送信しようとした場合に入力エラーメッセージを表示する
3. When フォームを送信したとき（モックアップ段階）, the App③ shall 「登録しました（モック）」旨のフィードバックを表示し、I-01 または I-02 に遷移する（実際のデータ追加は行わない）
4. The App③ shall I-06 と I-07 で `ItemForm` コンポーネントを共用する

---

### Requirement 9: I-07 編集画面

**Objective:** As a ユーザー, I want 既存アイテムを編集したい, so that 場所や残量を最新状態に更新できる

#### Acceptance Criteria
1. When `/items/[iri]/edit` に遷移したとき, the App③ shall 対応するモックレコードの現在値でフォームをプリフィルする
2. The App③ shall I-06 と同じ `ItemForm` コンポーネントを再利用し、編集モードで表示する
3. When フォームを送信したとき（モックアップ段階）, the App③ shall 「更新しました（モック）」旨のフィードバックを表示し、I-03 詳細画面に遷移する（実際のデータ更新は行わない）
4. If 指定された `iri` のレコードが存在しないとき, the App③ shall エラーメッセージと戻りリンクを表示する

---

### Requirement 10: I-08 設定画面

**Objective:** As a ユーザー, I want アプリの基本設定を確認したい, so that 接続先やアプリ情報を把握できる

#### Acceptance Criteria
1. When `/settings` に遷移したとき, the App③ shall アプリバージョン・現在の接続モード（mock / live）・各 Provider の接続先 URL（モックアップ段階ではプレースホルダー）を表示する
2. The App③ shall I-05 重複検出へのリンクを設定画面内に含める（または独立した `/duplicates` ルートへのナビゲーション）
3. The App③ shall モックアップフェーズ中は認証・ログアウト UI を表示しない

---

### Requirement 11: Vercel デプロイ要件

**Objective:** As a 開発者, I want モックアップを Vercel で共有したい, so that チームが実機で UI/UX を確認できる

#### Acceptance Criteria
1. The App③ shall `npm run build` がエラーなく完了する
2. The App③ shall `npm run lint` が警告・エラーなく完了する
3. The App③ shall `NEXT_PUBLIC_USE_MOCK=true` を Vercel 環境変数に設定することでモックアップモードで動作する
4. The App③ shall Next.js 16.2.6 の App Router 規約に従い、`node_modules/next/dist/docs/` に記載の破壊的変更に準拠する

---

### Requirement 12: 非機能要件

**Objective:** As a 開発者, I want コードベースの品質を一定水準に保ちたい, so that 実接続フェーズへの移行がスムーズになる

#### Acceptance Criteria
1. The App③ shall TypeScript の `strict: true` モードでコンパイルエラーが 0 件である
2. The App③ shall `any` 型を使用しない
3. The App③ shall モックデータをコンポーネント内にインラインで定義せず、必ず `lib/mock-data.ts` から import する
4. The App③ shall `components/ItemForm.tsx` を I-06・I-07 で共用し、フォームロジックを重複させない
5. While モックアップモードのとき, the App③ shall Provider API へのネットワークリクエストを一切発生させない
