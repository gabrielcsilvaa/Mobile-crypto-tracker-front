import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { endpoints } from '../api/endpoints';
import { CoinDetails } from '../types/Coin';

export const useCoinDetails = (coinId: string) =>
  useQuery({
    queryKey: ['coin', coinId],
    queryFn: async () => (await api.get<CoinDetails>(endpoints.coins.details(coinId))).data,
  });
