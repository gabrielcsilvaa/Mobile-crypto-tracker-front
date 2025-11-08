// src/components/PortfolioCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function PortfolioCard({ total, profit, pct }: { total: number; profit: number; pct: number }) {
  const { colors } = useTheme();
  const num = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(v);
  const positive = profit >= 0;
  return (
    <View style={{ padding: 16, gap: 8, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
      <Text style={{ color: colors.text, opacity: 0.8 }}>Valor total</Text>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>${num(total)}</Text>
      <Text style={{ color: positive ? '#22c55e' : '#ef4444' }}>
        {positive ? '+' : ''}
        {num(profit)} ({num(pct)}%)
      </Text>
    </View>
  );
}
