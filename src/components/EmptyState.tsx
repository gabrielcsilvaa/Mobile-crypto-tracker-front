import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

export type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: colors.text, opacity: 0.8, textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  );
}
