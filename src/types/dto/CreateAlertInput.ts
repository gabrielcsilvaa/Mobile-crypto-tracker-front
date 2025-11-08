export type CreateAlertInput = {
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  condition: 'above' | 'below';
  target_price_usd: number;
};