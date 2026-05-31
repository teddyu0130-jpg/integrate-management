export type StockLevel = 'full' | 'half' | 'ok' | 'low' | 'empty';

export interface UnifiedRecord {
  iri: string;
  name: string;
  category: string;
  location: string;
  stock_level: StockLevel;
  note: string;
  updated_at: string;
}
