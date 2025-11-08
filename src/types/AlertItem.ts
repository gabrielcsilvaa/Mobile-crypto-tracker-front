export type AlertItem = {
  id: number | string;
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  condition: 'above' | 'below';
  target_price_usd: number;
  created_at?: string;
  triggered?: boolean;
};