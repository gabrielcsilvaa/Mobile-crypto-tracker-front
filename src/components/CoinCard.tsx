import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  image: string;
  name: string;
  symbol: string;
  price: number;
  changePct?: number;         // 24h %
  volume24h?: number;        // novo
  favorite?: boolean;        // novo
  onToggleFavorite?: () => void; // novo
  onPress?: () => void;
  right?: React.ReactNode;
};

export default function CoinCard({
  image, name, symbol, price, changePct,
  volume24h = 0, favorite = false, onToggleFavorite, onPress
}: Props) {
  const { colors } = useTheme();
  const up = (changePct ?? 0) >= 0;
  const pct = typeof changePct === 'number' ? changePct : undefined;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Image source={{ uri: image }} style={{ width: 32, height: 32, borderRadius: 16 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>
          {name} <Text style={{ opacity: 0.6 }}>({symbol.toUpperCase()})</Text>
        </Text>
        <Text style={{ color: colors.text, opacity: 0.8 }}>
          ${price.toLocaleString()} •{' '}
          {typeof changePct === 'number' && (
            <Text style={{ opacity: 0.6, color: colors.text }}>
              {changePct >= 0 ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
            </Text>
          )}
        </Text>
        <Text style={{ color: colors.text, opacity: 0.6 }}>
          Vol 24h: ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(volume24h)}
        </Text>
      </View>
      <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={22} color={favorite ? '#ef4444' : colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
