# Requirements Document

## Project Description (Input)
辞書の `writable_to` マッピングに従い、登録・編集・削除・残量変更を対象 Provider の Data Endpoint へ委譲する書き込み API（`api/items/write/route.ts`）の実装。App③ 自身は DB を持たず、location 系 → App①、stock_level 系 → App② へそれぞれ振り分ける。書き込み後は統合ビューを再取得して返す。

## Requirements
<!-- Will be generated in /kiro:spec-requirements phase -->
