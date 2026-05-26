'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { StockLevel, UnifiedRecord } from '@/types';

const STOCK_LEVELS: { value: StockLevel; label: string }[] = [
  { value: 'full', label: '満タン' },
  { value: 'ok', label: '良好' },
  { value: 'low', label: '残少' },
  { value: 'empty', label: '切れ' },
];

interface ItemFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<UnifiedRecord>;
  onSubmit?: (data: Omit<UnifiedRecord, 'iri' | 'updated_at'>) => void;
}

export default function ItemForm({ mode, initialData, onSubmit }: ItemFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? '');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [stockLevel, setStockLevel] = useState<StockLevel>(
    initialData?.stock_level ?? 'ok',
  );
  const [note, setNote] = useState(initialData?.note ?? '');
  const [nameError, setNameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError('');

    if (!name.trim()) {
      setNameError('名前は必須です');
      return;
    }

    const data: Omit<UnifiedRecord, 'iri' | 'updated_at'> = {
      name: name.trim(),
      category: category.trim(),
      location: location.trim(),
      stock_level: stockLevel,
      note: note.trim(),
    };

    onSubmit?.(data);

    const message =
      mode === 'create' ? '登録しました（モック）' : '更新しました（モック）';
    setSuccessMessage(message);

    setTimeout(() => {
      if (mode === 'create') {
        router.push('/home');
      } else {
        const iri = initialData?.iri;
        router.push(iri ? `/items/${encodeURIComponent(iri)}` : '/home');
      }
    }, 800);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <p className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="name">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
        {nameError && (
          <p className="mt-1 text-xs text-red-600">{nameError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="category">
          カテゴリ
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="location">
          収納場所
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="stock_level">
          残量
        </label>
        <select
          id="stock_level"
          value={stockLevel}
          onChange={(e) => setStockLevel(e.target.value as StockLevel)}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        >
          {STOCK_LEVELS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="note">
          メモ
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        {mode === 'create' ? '登録する' : '更新する'}
      </button>
    </form>
  );
}
