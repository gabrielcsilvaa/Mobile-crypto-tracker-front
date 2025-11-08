import React from 'react';
import {
  View,
  FlatList,
  Button,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAlerts, useRemoveAlert } from '../../hooks/useAlerts';
import { useTheme } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';

export default function AlertsScreen() {
  const { colors } = useTheme(); // 🎨 pega cores globais
  const { data, isLoading, isFetching, refetch } = useAlerts();
  const remove = useRemoveAlert();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item, index) => `${String((item as any).id ?? index)}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              borderBottomWidth: 1,
              borderColor: colors.border ?? '#333',
              gap: 6,
            }}
          >
            <Text
              style={{
                fontWeight: '700',
                color: colors.text, 
              }}
            >
              {item.coin_name} ({item.coin_symbol?.toUpperCase?.() || item.coin_symbol})
            </Text>
            <Text style={{ color: colors.text, opacity: 0.8 }}>
              Condição: {item.condition} • Alvo: ${item.target_price_usd}
            </Text>
            <Button
              title={remove.isPending ? 'Removendo' : 'Remover'}
              onPress={() => remove.mutate(item.id)}
              disabled={remove.isPending}
              color="#d9534f"
            />
          </View>
        )}
        ListEmptyComponent={<EmptyState message='Nenhum alerta criado ainda.' />}
        contentContainerStyle={data && data.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
}
