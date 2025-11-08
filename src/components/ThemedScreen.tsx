import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedSafeAreaView, ThemedView } from './Themed';

type Props = React.PropsWithChildren<{ padded?: boolean }>;

export default function ThemedScreen({ children, padded = true }: Props) {
  return (
    <ThemedSafeAreaView style={styles.flex}>
      <ThemedView style={[styles.flex, padded && styles.padded]}>{children}</ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { padding: 16 },
});
