'use server';

import type { CreateItemInput } from '@/lib/ontology-engine';
import * as engine from '@/lib/ontology-engine';

export type { CreateItemInput };

export async function createItem(input: CreateItemInput): Promise<{ error: string | null }> {
  if (process.env.NEXT_PUBLIC_USE_MOCK?.trim() === 'true') {
    console.log('[mock] createItem', input);
    return { error: null };
  }
  return engine.createItem(input);
}
