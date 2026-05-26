# プロジェクト構造

## 構成方針

レイヤーファースト：UI 関心事は `src/app/`、Federation ロジックは `lib/`、意味の知識は `ontologies/` に置く。`lib/`（汎用エンジン）と `ontologies/`（Provider 固有の辞書）の間の厳格な境界が、このアーキテクチャの中心的な不変条件です。この境界を越える行為（例：TypeScript 内に Provider のフィールド名をハードコード）は FR-10 / NFR-07 違反です。

## ディレクトリパターン

### App Router（UI + API）
**場所**：`src/app/`  
**目的**：Next.js App Router のページと API ルート  
**パターン**：ディレクトリがルートセグメント。UI ページは `(ui)/` 配下（`login/`・`home/`・`shopping/`・`items/[iri]/`・`items/new/`・`items/[iri]/edit/`・`settings/`）。API は `api/items/route.ts`（GET 統合ビュー）と `api/items/write/route.ts`（POST / PATCH / DELETE 委譲書き込み）の 2 本

### Federation Engine
**場所**：`lib/ontology-engine.ts`  
**目的**：汎用の「読み取り：fetch → IRI グループ化 → 属性解決」「委譲書き込み：`writable_to` を引いて Provider に振り分け → 書き込み後に統合ビューを再取得」ループ  
**制約**：Provider 固有のフィールド名・テーブル名を一切含まないこと。そうした知識はすべて `ontologies/` に属する

### 意味の辞書
**場所**：`ontologies/`  
**目的**：Provider ごとの属性マッピングと統合ビュー定義を宣言する YAML ファイル  
**ファイル**：
- `app1_mapping.yaml`：App① フィールドの解釈
- `app2_mapping.yaml`：App② フィールドの解釈
- `unified_view.yaml`：エンジンが参照する統合属性定義

**黄金律**：新 Provider の追加 = マッピング YAML の追加 + `unified_view.yaml` の追記。TypeScript には触れない。

### モックデータ（モックアップフェーズ）
**場所**：`lib/mock-data.ts`（または `lib/mock/`）  
**目的**：実接続前の静的サンプルデータ。統合レコード型（`UnifiedRecord[]`）と同形で用意し、実接続時に差し替えやすくする  
**制約**：モックと実接続の切り替えは環境変数 1 つで行える設計にする。モックデータをコンポーネント内にハードコードしない

### 共有コンポーネント
**場所**：`components/`  
**目的**：複数画面で再利用する UI コンポーネント  
**例**：`ItemForm.tsx`（I-06 登録・I-07 編集で共用する同一フォーム）

### ルート設定ファイル
**場所**：プロジェクトルート  
**目的**：`next.config.ts`・`tsconfig.json`・`eslint.config.mjs`・`postcss.config.mjs`

## 命名規則

- **ファイル名**：ルートや辞書は `kebab-case`。lib モジュールは `camelCase`（`ontology-engine.ts`）
- **コンポーネント**：PascalCase の React コンポーネント（例：`src/app/(ui)/FindMode.tsx`）
- **API ルート**：Next.js の慣例——セグメントディレクトリ内の `route.ts`

## インポート規則

```typescript
import { unifiedItems } from '@/lib/ontology-engine'  // エイリアス経由の絶対パス
import type { UnifiedRecord } from '@/types'
import { localHelper } from './local-util'             // 同階層は相対パス
```

**パスエイリアス**：
- `@/` → `./src/`

## コード構成の原則

- **エンジンは汎用を保つ**：`ontology-engine.ts` はファイル名で `ontologies/` を直接 import しない。辞書はパース済みの入力として受け取る
- **辞書がすべてを駆動する**：属性解決の順序・派生属性のルール・書き込み先エンドポイントは YAML で宣言し、TypeScript には書かない
- **障害の局所化**：Provider の fetch 失敗はプロバイダー単位でキャッチ。エンジンは取得できたデータで処理を継続し、欠落属性を注記して返す
- **委譲書き込みパターン**：Provider DB への直接書き込みは禁止。残量変更・登録・編集・削除はすべて `api/items/write/route.ts` を経由し、辞書の `writable_to` マッピングに従い対応 Provider エンドポイントへ委譲する。書き込み後は統合ビューを再取得して返す

---
_パターンを記述する。ディレクトリツリーを列挙しない。パターンに従った新規ファイル追加では更新不要_
