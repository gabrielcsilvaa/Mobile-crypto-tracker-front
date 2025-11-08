export type CoinListItem = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  coin_image?: string; 
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
};

export type CoinDetails = CoinListItem & {
  description: string;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_date: string;
  links: { homepage: string };
};

export type ChartPoint = [number, number]; // [timestamp_ms, price]
