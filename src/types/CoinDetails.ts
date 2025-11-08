export type CoinDetails = {
  id: string;
  name: string;
  symbol: string;
  rank?: number;
  description?: string;
  price_usd: number;
  market_cap_usd?: number;
  volume_24h_usd?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number | null;
  percent_change_24h?: number; // changePct se preferir
  image?: string | null;        // url opcional
};
