// src/screens/home/CoinsListScreen.tsx
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  View, FlatList, RefreshControl, ActivityIndicator, Modal, TextInput, TouchableOpacity, Text
} from 'react-native';
import { useCoins } from '../../hooks/useCoins';
import CoinCard from '../../components/CoinCard';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesList, useAddFavorite, useRemoveFavorite } from '../../hooks/useFavorites';
import HomePortfolioSummary from '../../components/HomePortfolioSummary';

export default function CoinListScreen() {
  const nav = useNavigation<any>();
  const { colors } = useTheme();

  // paginação infinita
  const { data, fetchNextPage, hasNextPage, refetch, isFetching, isLoading } = useCoins();
  const pages = data?.pages ?? [];
  const itemsRaw = pages.flatMap((p: any) => p.results ?? []);
  const itemsTop100 = useMemo(() => itemsRaw.slice(0, 100), [itemsRaw]);

  // favoritos
  const favList = useFavoritesList();            // -> deve trazer [{ id: favoriteId, coin_id: 'bitcoin', ...}, ...]
  const addFav  = useAddFavorite();              // -> addFav.mutate(coinId)  (ou {coin_id: coinId}, depende do seu hook)
  const rmFav   = useRemoveFavorite();           // -> rmFav.mutate(favoriteId)

  const favorites = favList.data ?? [];

  // Set com COIN_IDs favoritos (para pintar o coração)
  const favCoinIdSet = useMemo(() => {
    return new Set(
      favorites.map((f: any) => String(f.coin_id ?? f.coinId ?? f.id)) // fallback se sua API vier diferente
    );
  }, [favorites]);

  // Mapa coinId -> favoriteId (para remover corretamente)
  const coinToFavoriteId = useMemo(() => {
    const m = new Map<string, string | number>();
    favorites.forEach((f: any) => {
      const coinKey = String(f.coin_id ?? f.coinId ?? f.id);
      m.set(coinKey, String(f.id));
    });
    return m;
  }, [favorites]);

  // refetch de favoritos quando a tela ganha foco (garante estado vermelho ao voltar de outra page)
  useFocusEffect(
    useCallback(() => {
      favList.refetch?.();
    }, [favList])
  );

  // modal de busca
  const [showSearch, setShowSearch] = useState(false);
  const [term, setTerm] = useState('');
  const itemsFiltered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return itemsTop100;
    return itemsTop100.filter((i: any) =>
      i.name?.toLowerCase().includes(t) || i.symbol?.toLowerCase().includes(t)
    );
  }, [itemsTop100, term]);

  // ícone de busca na header
  useLayoutEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowSearch(true)} style={{ paddingHorizontal: 8 }}>
          <Ionicons name="search" size={20} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [nav, colors.text]);

  // toggle favorito agora remove pelo favoriteId correto
  const toggleFavorite = useCallback((coinId: string) => {
    const key = String(coinId);
    if (favCoinIdSet.has(key)) {
      const favoriteId = coinToFavoriteId.get(key);
      if (favoriteId) rmFav.mutate(String(favoriteId));
    } else {
      // se seu hook de add aceita só o coinId:
      addFav.mutate(coinId);
      // caso seu hook exija objeto, use: addFav.mutate({ coin_id: coinId })
    }
  }, [favCoinIdSet, coinToFavoriteId, addFav, rmFav]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={itemsFiltered}
          keyExtractor={(item: any) => String(item.id)}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={<HomePortfolioSummary />}
          renderItem={({ item }: any) => (
            <CoinCard
              image={item.image}
              name={item.name}
              symbol={item.symbol}
              price={item.current_price}
              changePct={item.price_change_percentage_24h}
              volume24h={item.total_volume}
              favorite={favCoinIdSet.has(String(item.id))}    // ♥ persistente
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => nav.navigate('CoinDetails', { coinId: item.id, coin: item })}
            />
          )}
        />
      )}

      {/* Modal de Busca */}
      <Modal visible={showSearch} transparent animationType="fade" onRequestClose={() => setShowSearch(false)}>
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24
        }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Buscar moeda</Text>
            <TextInput
              placeholder="Digite nome ou símbolo..."
              placeholderTextColor={colors.text + '99'}
              value={term}
              onChangeText={setTerm}
              autoFocus
              style={{
                borderWidth: 1, borderColor: colors.border, borderRadius: 8,
                paddingHorizontal: 12, paddingVertical: 10, color: colors.text
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
              <TouchableOpacity onPress={() => { setTerm(''); setShowSearch(false); }}>
                <Text style={{ color: colors.text }}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Text style={{ color: colors.primary }}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
