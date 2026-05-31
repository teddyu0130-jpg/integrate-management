import { createClient } from '@supabase/supabase-js';
import type { UnifiedRecord, StockLevel } from '@/types';

const FIXED_HOUSEHOLD_ID = '00000000-0000-0000-0000-000000000001';

function monoClient() {
  return createClient(
    process.env.MONO_SUPABASE_URL!.trim(),
    process.env.MONO_SUPABASE_ANON_KEY!.trim(),
  );
}

function stockClient() {
  return createClient(
    process.env.STOCK_SUPABASE_URL!.trim(),
    process.env.STOCK_SUPABASE_ANON_KEY!.trim(),
  );
}

type Item = {
  iri: string;
  name: string;
  category: string;
  location: string;
  location_note: string | null;
  note: string | null;
  updated_at: string;
};

type Consumable = {
  iri: string;
  name: string;
  category: string;
  stock_level: StockLevel;
  note: string | null;
  updated_at: string;
};

export async function getItems(): Promise<UnifiedRecord[]> {
  const [itemsResult, consumablesResult] = await Promise.all([
    monoClient()
      .from('items')
      .select('iri, name, category, location, location_note, note, updated_at')
      .eq('household_id', FIXED_HOUSEHOLD_ID),
    stockClient()
      .from('consumables')
      .select('iri, name, category, stock_level, note, updated_at')
      .eq('household_id', FIXED_HOUSEHOLD_ID),
  ]);

  const items: Item[] = itemsResult.data ?? [];
  const consumables: Consumable[] = consumablesResult.data ?? [];

  const consumableByName = new Map(
    consumables.map((c) => [c.name.toLowerCase(), c]),
  );
  const itemByName = new Map(
    items.map((b) => [b.name.toLowerCase(), b]),
  );

  const records = new Map<string, UnifiedRecord>();

  for (const b of items) {
    const key = b.name.toLowerCase();
    const c = consumableByName.get(key);
    records.set(key, {
      iri: b.iri,
      name: b.name,
      category: b.category,
      location: b.location ?? '',
      stock_level: c?.stock_level ?? 'ok',
      note: b.note ?? c?.note ?? '',
      updated_at: b.updated_at,
    });
  }

  for (const c of consumables) {
    const key = c.name.toLowerCase();
    if (itemByName.has(key)) continue;
    records.set(key, {
      iri: c.iri,
      name: c.name,
      category: c.category,
      location: '',
      stock_level: c.stock_level,
      note: c.note ?? '',
      updated_at: c.updated_at,
    });
  }

  return Array.from(records.values());
}

export async function getItem(iri: string): Promise<UnifiedRecord | null> {
  const items = await getItems();
  return items.find((item) => item.iri === iri) ?? null;
}
