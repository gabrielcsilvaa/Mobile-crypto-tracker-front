// src/components/PriceChange.tsx
import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

type Props = {
  value: number;
};

export default function PriceChange({ value }: Props) {
  const { colors } = useTheme();

  const isUp = value >= 0;
  const color = isUp ? '#22c55e' : '#ef4444'; 
  const sign = isUp ? '+' : '';

  return (
    <Text
      style={{
        color,
        fontWeight: '600',
        backgroundColor: colors.card, 
        paddingHorizontal: 2,
      }}
    >
      {sign}
      {value.toFixed(2)}%
    </Text>
  );
}
