// src/hooks/usePortfolio.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { endpoints } from '../api/endpoints';

export const usePortfolio = () =>
  useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => (await api.get(endpoints.portfolio.get)).data,
    staleTime: 30_000,
  });

export const useAddHolding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      coin_id: string;
      amount: number;
      purchase_price_usd: number;
      purchase_date: string; // 'YYYY-MM-DD'
    }) => api.post(endpoints.portfolio.create, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portfolio'] }),
  });
};

export const useUpdateHolding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; amount?: number; purchase_price_usd?: number; purchase_date?: string }) =>
      api.patch(endpoints.portfolio.update(id), payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portfolio'] }),
  });
};

export const useRemoveHolding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(endpoints.portfolio.remove(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portfolio'] }),
  });
};
