export type Holding = {
  id: string;            // ou number, ajuste conforme seu backend
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  quantity: number;      // quantidade que o usuário possui
  avg_price_usd: number; // preço médio
  created_at?: string;
  updated_at?: string;
  coin_image?: string;   // opcional, evita erro caso a UI use
};

export type CreateHoldingInput = {
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  quantity: number;
  avg_price_usd: number;
};

export type UpdateHoldingInput = Partial<Pick<CreateHoldingInput, 'quantity' | 'avg_price_usd'>>;
