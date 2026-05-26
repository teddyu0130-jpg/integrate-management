# Research & Design Decisions

## Summary
- **Feature**: `ui-mockup`
- **Discovery Scope**: New Feature（グリーンフィールド UI — `src/app/page.tsx` 以外は未実装）
- **Key Findings**:
  - Next.js 16.2.6 は App Router 規約が確立されており、`src/app/(ui)/` の Route Group パターンが共通レイアウト分離に有効
  - モックと実接続の切り替えは `lib/data.ts` のデータアクセス層を 1 ファイルに集約し、環境変数で分岐することで実現できる（コンポーネントを汚染しない）
  - 動的ルート `items/[iri]` における `iri` は URL エンコードが必要（IRI に `#` 等が含まれる場合）

## Research Log

### Next.js 16.2.6 App Router パターン確認
- **Context**: AGENTS.md が「破壊的変更あり」と警告 — コード前に docs 確認を義務付け
- **Sources Consulted**: `node_modules/next/dist/docs/01-app/01-getting-started/`
- **Findings**:
  - Route Groups `(name)` は URL に影響しない — `(ui)/layout.tsx` で共通 BottomNav を提供可能
  - Dynamic Segments `[iri]` は `params` prop で受け取る（型: `Promise<{ iri: string }>` — Next.js 15+ で非同期化）
  - Server Components がデフォルト。`"use client"` はインタラクティブ部分のみ
  - `usePathname` / `useSearchParams` は Client Component でのみ使用可能
- **Implications**: pages は Server Component、BottomNav・ItemForm・HomeViewToggle は Client Component に分類する

### 環境変数切り替え設計
- **Context**: Req 1.5 / 1.6 — 環境変数 1 つでモックと実接続を切り替える
- **Findings**:
  - `NEXT_PUBLIC_USE_MOCK` はクライアント・サーバー両方で参照可能
  - Server Component では `process.env.NEXT_PUBLIC_USE_MOCK` が直接使える
  - `lib/data.ts` にデータアクセスを集約し、単一分岐点を作ることで全ページが恩恵を受ける
- **Implications**: `lib/data.ts` がモックアップ→実接続移行の唯一の変更点になる

### IRI のパラメータ化
- **Context**: `/items/[iri]` の動的ルート — IRI は URN 形式（例: `urn:household:item:001`）
- **Findings**: Next.js の dynamic segment は `:` を含む文字列を許容する。`encodeURIComponent` 処理は Link コンポーネント側で行う
- **Implications**: `params.iri` を受け取る際は `decodeURIComponent` して lookup する

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Route Group + 共通レイアウト | `(ui)/layout.tsx` で BottomNav を一括提供 | 重複なし、全画面に自動適用 | 将来的に Auth Layout を挟む際は再構成が必要 | 採用 — モックアップ段階では最適 |
| データアクセス層集約 | `lib/data.ts` が `mock-data.ts` / `ontology-engine.ts` を切り替え | 全 page が同一 interface を使う、移行コスト最小 | lib/data.ts が肥大化するリスク | 採用 |
| 各 page に直接 import | page ごとに `mock-data.ts` を import | シンプル | 実接続移行時に全 page 修正が必要（Req 1.6 違反） | 不採用 |

## Design Decisions

### Decision: Server / Client Component 分割方針
- **Context**: Next.js App Router は Server Component がデフォルト。モックアップでも正しく分類する
- **Alternatives Considered**:
  1. 全コンポーネントを `"use client"` — 実装が簡単だが Server Component の利点を失う
  2. Server/Client を適切に分割 — コード量は増えるが設計として正しい
- **Selected Approach**: pages はすべて Server Component。BottomNav（`usePathname`）、ItemForm（form state）、HomeViewToggle（`useSearchParams`）のみ Client Component
- **Rationale**: 実接続フェーズで `lib/ontology-engine.ts` が Server-side fetch を行うため、pages を Server Component に保つことで移行コストが下がる
- **Trade-offs**: Client Component への props 渡しが増えるが、型安全性は向上

### Decision: I-01/I-02 の実装方法
- **Context**: 同一データを 2 つのビュー（Find Mode / Replenish Mode）で表示
- **Alternatives Considered**:
  1. 別ルート `/home/find` と `/home/replenish`
  2. 単一ルート `/home` に searchParam `?view=find|replenish`
- **Selected Approach**: Option 2（searchParam `?view=find|replenish`、デフォルト `find`）
- **Rationale**: BottomNav のアクティブ状態が `/home` 1 パターンで管理できる。URL が bookmark 可能
- **Trade-offs**: `useSearchParams` を使う `HomeViewToggle` Client Component が必要

## Risks & Mitigations
- `params` の非同期化（Next.js 15+）— `await params` を忘れると型エラー。型定義で強制する
- IRI の URL エンコーディング — `:` は通常問題ないが、テストデータに `#` を含めない
- モックのみモードで `lib/ontology-engine.ts` が存在しない場合のビルドエラー — stub ファイルを用意する

## References
- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
