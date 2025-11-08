// src/screens/portfolio/PortfolioScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { usePortfolio, useRemoveHolding, useUpdateHolding, useAddHolding } from '../../hooks/usePortfolio';
import PortfolioCard from '../../components/PortfolioCard';

const num = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(v);

export default function PortfolioScreen() {
  const { colors } = useTheme();
  const { data, isLoading, isFetching, refetch } = usePortfolio();
  const removeHolding = useRemoveHolding();
  const updateHolding = useUpdateHolding();
  const addHolding = useAddHolding();

  // mock do "modal" de adicionar/editar (substitua depois por um modal bonitinho)
  const [busy, setBusy] = useState(false);

  const hasHoldings = (data?.holdings?.length ?? 0) > 0;

  const totalCard = useMemo(() => ({
    total: data?.total_value_usd ?? 0,
    profit: data?.total_profit_usd ?? 0,
    pct: data?.total_profit_percentage ?? 0,
  }), [data]);

  const onRemove = (id: string) => {
    Alert.alert('Remover holding', 'Deseja remover este ativo do portfólio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => removeHolding.mutate(id),
      },
    ]);
  };

  const onQuickEditAmount = (id: string, currentAmount: number) => {
    Alert.prompt(
      'Editar quantidade',
      'Informe a nova quantidade',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: (txt?: string) => {
            const amount = Number(txt);
            if (!isFinite(amount) || amount <= 0) return Alert.alert('Quantidade inválida');
            updateHolding.mutate({ id, amount });
          },
        },
      ],
      'plain-text',
      String(currentAmount)
    );
  };

  const onAddQuick = () => {
    // Exemplo mínimo: adiciona 0.01 BTC comprado hoje a $42000
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    addHolding.mutate(
      { coin_id: 'bitcoin', amount: 0.01, purchase_price_usd: 42000, purchase_date: today },
      { onSettled: () => setBusy(false) }
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PortfolioCard total={totalCard.total} profit={totalCard.profit} pct={totalCard.pct} />

      {!hasHoldings ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: colors.text, opacity: 0.8, textAlign: 'center' }}>
            Seu portfólio está vazio. Toque no botão “+” para adicionar sua primeira holding.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.holdings ?? []}
          keyExtractor={(i) => String(i.id)}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <View style={{ padding: 14, borderBottomWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>
                    {item.coin_name} ({String(item.coin_symbol || '').toUpperCase()})
                  </Text>
                  <Text style={{ color: colors.text, opacity: 0.8 }}>Qtd: {item.amount}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: colors.text }}>${num(item.current_value_usd)}</Text>
                  <Text style={{ color: item.profit_usd >= 0 ? '#22c55e' : '#ef4444' }}>
                    {item.profit_usd >= 0 ? '+' : ''}
                    {num(item.profit_usd)} ({num(item.profit_percentage)}%)
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => onQuickEditAmount(item.id, item.amount)}
                  style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: colors.card }}
                >
                  <Text style={{ color: colors.text }}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onRemove(item.id)}
                  style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#ef4444' }}
                >
                  <Text style={{ color: 'white' }}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB [+] */}
      <TouchableOpacity
        onPress={onAddQuick}
        disabled={busy}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          elevation: 4,
        }}
      >
        <Text style={{ color: 'white', fontSize: 28, marginTop: -2 }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}
