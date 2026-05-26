'use client';

export default function DeleteButton() {
  return (
    <button
      onClick={() => alert('削除機能は実接続フェーズで実装予定です')}
      className="flex-1 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      削除
    </button>
  );
}
