export type CreateAlertInput = {
  coin_id: string;
  condition: 'above' | 'below';
  target_price_usd: number;
};
