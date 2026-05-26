# Requirements Document

## Project Description (Input)
IRI キーで複数 Provider（App①・App②）のデータを横断的に並列 fetch し、共有 IRI でレコードをグループ化・属性解決して統合ビュー（UnifiedRecord）を生成する Federation Engine の実装。`lib/ontology-engine.ts` と `api/items/route.ts` が主な対象。辞書（ontologies/*.yaml）に基づき汎用ループで動作し、Provider 固有の知識を一切含まない。

## Requirements
<!-- Will be generated in /kiro:spec-requirements phase -->
