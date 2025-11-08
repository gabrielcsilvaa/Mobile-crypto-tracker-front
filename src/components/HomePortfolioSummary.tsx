import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAuthStore } from '../store/authStore'; // seu Zustand

export default function HomePortfolioSummary() {
  const token = useAuthStore((s) => s.accessToken);
  const { colors } = useTheme();
  const { data, isLoading } = token ? usePortfolio() : { data: undefined, isLoading: false };

  if (!token) return null;

  return (
    <View style={{ padding: 14, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
      <Text style={{ color: colors.text, opacity: 0.7, marginBottom: 4 }}>Seu Portfólio</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>
            ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(data?.total_value_usd ?? 0)}
          </Text>
          <Text style={{ color: (data?.total_profit_usd ?? 0) >= 0 ? '#22c55e' : '#ef4444' }}>
            {(data?.total_profit_usd ?? 0) >= 0 ? '+' : ''}
            {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(data?.total_profit_usd ?? 0)} (
            {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(data?.total_profit_percentage ?? 0)}%)
          </Text>
        </>
      )}
    </View>
  );
}
