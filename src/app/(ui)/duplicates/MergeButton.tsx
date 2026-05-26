'use client';

export default function MergeButton({ name }: { name: string }) {
  return (
    <button
      onClick={() => alert(`「${name}」のマージは実接続フェーズで実装予定です`)}
      className="w-full rounded-md border border-yellow-400 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
    >
      マージ
    </button>
  );
}
