import type { UnifiedRecord } from '@/types';

// モックアップフェーズのスタブ実装。
// 実接続フェーズで Provider の REST エンドポイントを並列 fetch する実ロジックに差し替える。
export async function getItems(): Promise<UnifiedRecord[]> {
  return [];
}

export async function getItem(_: string): Promise<UnifiedRecord | null> {
  return null;
}
