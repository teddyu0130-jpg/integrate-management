import type { UnifiedRecord, ProviderErrors } from '@/types';
import { MOCK_ITEMS } from '@/lib/mock-data';
import * as engine from '@/lib/ontology-engine';

export interface GetItemsResult {
  items: UnifiedRecord[];
  providerErrors: ProviderErrors;
}

const NO_ERRORS: ProviderErrors = { mono: null, stock: null };

export async function getItems(): Promise<GetItemsResult> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    return { items: MOCK_ITEMS, providerErrors: NO_ERRORS };
  }
  return engine.getItems();
}

export async function getItem(iri: string): Promise<UnifiedRecord | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    return MOCK_ITEMS.find((item) => item.iri === iri) ?? null;
  }
  return engine.getItem(iri);
}
