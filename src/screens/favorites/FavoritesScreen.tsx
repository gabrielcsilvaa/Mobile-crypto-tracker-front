// src/screens/favorites/FavoritesScreen.tsx
import React from 'react';
import {
  View,
  FlatList,
  Button,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFavoritesList, useRemoveFavorite } from '../../hooks/useFavorites';
import CoinCard from '../../components/CoinCard';
import { useNavigation, CommonActions, useTheme } from '@react-navigation/native';
import { FavoriteItem } from '../../types/FavoriteItem';
import EmptyState from '../../components/EmptyState';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data, isLoading, isFetching, refetch } = useFavoritesList();
  const removeFav = useRemoveFavorite();

  const favorites = (data as FavoriteItem[]) ?? [];

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList<FavoriteItem>
        data={favorites}
        keyExtractor={(item, index) => `${String(item.coin_id ?? item.id)}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => {
          const image = item.coin_image ?? '';
          const name = item.coin_name ?? '';
          const symbol = item.coin_symbol ?? '';
          const price = item.current_price ?? 0;
          const coinId = item.coin_id ?? item.id;

          return (
            <View
              style={{
                padding: 14,
                borderTopWidth: 1,
                borderTopColor: colors.border ?? '#333',
                gap: 6,
              }}
            >
              <CoinCard
                image={image}
                name={name}
                symbol={symbol}
                price={price}
                // changePct opcional; pode omitir
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'Home', // nome EXATO da Tab que contém o HomeStack
                      params: {
                        screen: 'CoinDetails',
                        params: { coinId },
                      },
                    })
                  );
                }}
              />

              <Button
                title={removeFav.isPending ? 'Removendo' : 'Remover'}
                onPress={() => removeFav.mutate(item.id)}
                disabled={removeFav.isPending}
                color="#d9534f"
              />
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState message='Seu Favorito esta vazio clique no ♥ para adicionar moedas favoritas.' />}
        contentContainerStyle={favorites.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
}
