// src/hooks/useFavorites.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { endpoints } from '../api/endpoints';


export const useFavoritesList = () =>
  useQuery({
    queryKey: ['favorites'],
    queryFn: async () => (await api.get(endpoints.favorites.list)).data as { id: string }[],
    staleTime: 30_000,
  });

export const useAddFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coinId: string) => api.post(endpoints.favorites.create, { coin_id: coinId }),
    onMutate: async (coinId) => {
      await qc.cancelQueries({ queryKey: ['favorites'] });
      const prev = qc.getQueryData<any>(['favorites']) ?? [];
      const next = Array.isArray(prev) ? [...prev, { id: coinId }] : [{ id: coinId }];
      qc.setQueryData(['favorites'], next);
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(['favorites'], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
};

export const useRemoveFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coinId: string | number) => api.delete(endpoints.favorites.remove(String(coinId))),
    onMutate: async (coinId) => {
      await qc.cancelQueries({ queryKey: ['favorites'] });
      const prev = qc.getQueryData<any>(['favorites']) ?? [];
      const next = Array.isArray(prev) ? prev.filter((f: any) => String(f.id) !== String(coinId)) : [];
      qc.setQueryData(['favorites'], next);
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(['favorites'], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
};
