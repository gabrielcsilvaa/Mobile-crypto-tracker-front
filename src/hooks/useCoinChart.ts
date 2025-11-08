import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { endpoints } from '../api/endpoints';
import { ChartPoint } from '../types/Coin';

export const useCoinChart = (coinId: string, days: string) =>
  useQuery({
    queryKey: ['chart', coinId, days],
    queryFn: async () => (await api.get<{ prices: ChartPoint[] }>(`${endpoints.coins.chart(coinId)}?days=${days}`)).data,
  });
