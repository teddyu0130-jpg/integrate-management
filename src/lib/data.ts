import type { UnifiedRecord } from '@/types';
import { MOCK_ITEMS } from '@/lib/mock-data';
import * as engine from '@/lib/ontology-engine';

export async function getItems(): Promise<UnifiedRecord[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    return MOCK_ITEMS;
  }
  return engine.getItems();
}

export async function getItem(iri: string): Promise<UnifiedRecord | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    return MOCK_ITEMS.find((item) => item.iri === iri) ?? null;
  }
  return engine.getItem(iri);
}
