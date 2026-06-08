'use server';

import type { CreateItemInput, MergeGroup } from '@/lib/ontology-engine';
import * as engine from '@/lib/ontology-engine';

export type { CreateItemInput, MergeGroup };

export async function createItem(input: CreateItemInput): Promise<{ error: string | null }> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    console.log('[mock] createItem', input);
    return { error: null };
  }
  return engine.createItem(input);
}

export async function restockItem(name: string): Promise<{ error: string | null }> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    console.log('[mock] restockItem', name);
    return { error: null };
  }
  return engine.updateStockLevel(name);
}

export async function mergeItems(group: MergeGroup): Promise<{ error: string | null }> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    console.log('[mock] mergeItems', group);
    return { error: null };
  }
  return engine.mergeItems(group);
}
