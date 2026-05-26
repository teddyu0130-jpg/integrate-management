# 技術スタック

## アーキテクチャ

ステートレスな Federation 層——App③ は自前の Supabase プロジェクトを持ちません。App①・App② の Supabase が REST API を提供し、App③ はそれを呼ぶだけです。業務データは各 Provider に分散保持されたままで、App③ はリクエスト時に YAML 辞書を読み込み、各 Provider エンドポイントを並列 fetch し、IRI でグループ化して属性を解決します。

**開発フェーズ**

| フェーズ | 内容 | デプロイ |
| --- | --- | --- |
| モックアップ | 静的モックデータで全画面 UI を実装。認証なし | Vercel |
| 実接続 | App①・App② の Data Endpoint に切り替え。認証方式は別途決定 | Vercel |

2 層の明確な分離：
1. **橋渡しコード**（`lib/ontology-engine.ts`）：汎用の「読み取り：fetch → グループ → 解決」「書き込み：writable_to を引いて Provider に委譲」ループ。Provider 固有の知識を含まない
2. **意味の辞書**（`ontologies/*.yaml`）：Provider 固有のフィールド名・マッピング・書き込み先（`writable_to`）・派生ルールをすべてここに集約

## 主要技術

- **言語**：TypeScript 5、strict モード
- **フレームワーク**：Next.js 16.2.6 — **破壊的変更を含むバージョン。コードを書く前に必ず `node_modules/next/dist/docs/` を確認すること**
- **UI ライブラリ**：React 19.2.4
- **スタイリング**：Tailwind CSS v4（`@tailwindcss/postcss` 経由）
- **認証・認可**：モックアップ段階では認証なし。実接続フェーズでの認証方式は未定（App① の Supabase Auth を流用するか別方式にするか後で決定）。設計上は `household_members.role`（owner / member / viewer）で UI 書き込み制御を行い、Provider 側 RLS でも担保する 2 段階認可を想定
- **デプロイ**：Vercel

## 主要ライブラリ

- `next/font/google`：Geist Sans / Geist Mono を `next/font` 経由で読み込み。CSS 変数 `--font-geist-sans`・`--font-geist-mono` として公開

## 開発標準

### 型安全性
TypeScript strict モード（`"strict": true`）。`any` 禁止。YAML 辞書はパース時に型付けする。

### コード品質
ESLint 9（`eslint-config-next` 16.2.6）。実行：`npm run lint`

### テスト
テストフレームワーク未設定。Federation の正しさは辞書ファイルへの `git diff` で検証（FR-06 の受入基準）。

## 開発環境

### 主要コマンド
```bash
# 開発:  npm run dev
# ビルド: npm run build
# Lint:  npm run lint
```

## 主要な技術的判断

| 判断 | 選択 | 理由 |
| --- | --- | --- |
| App③ ステートレス化 | 自前 DB なし | データ主権——各 Provider が自データを所有。Supabase 無料枠（2 プロジェクト）に収める |
| App③ 自前 Supabase なし | App①・App② の REST API を呼ぶのみ | Supabase 無料枠 2 枠を App①・App② に充てる。App③ の追加枠不要 |
| 書き込みは委譲 | Provider の Data Endpoint を辞書マッピング経由で呼ぶ | App③ がスキーマ知識を持たずにデータ主権を保つ。マネーフォワードが振込を銀行 API に投げる構図と同じ |
| モックアップ先行 | 静的モックデータで UI を全画面実装してから実接続 | UI/UX を固めてから接続ロジックを書く。Vercel で早期に動く状態を共有できる |
| 辞書をファイルで管理 | YAML、API 公開なし | 家庭スケールでは Provider 数が固定。動的カタログ不要 |
| IRI を結合キーに使用 | 単一文字列カラム | 各 Provider は独自 UUID を管理。IRI だけがリポジトリ間で共有される |
| 3 独立リポジトリ | モノレポではない | API 境界越えの統合を強制。アプリ間の import による結合を防止 |

---
_標準とパターンを記述する。すべての依存関係を列挙しない_
