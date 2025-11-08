import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { endpoints } from '../api/endpoints';
import { CoinListItem } from '../types/Coin';

type Page = { results: CoinListItem[]; next: string | null };

export function useCoins(search?: string) {
  return useInfiniteQuery<Page>({
    queryKey: ['coins', search],
    queryFn: async ({ pageParam }) => {
      const url = pageParam ?? `${endpoints.coins.list}?page=1&per_page=20${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const { data } = await api.get(url as string);
      return data;
    },
    getNextPageParam: (last) => last.next ?? undefined,
    initialPageParam: `${endpoints.coins.list}?page=1&per_page=20${search ? `&search=${encodeURIComponent(search)}` : ''}`,
  });
}
