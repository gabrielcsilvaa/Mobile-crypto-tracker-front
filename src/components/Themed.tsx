import React from 'react';
import {
  View as RNView,
  Text as RNText,
  ScrollView as RNScrollView,
  TouchableOpacity as RNTouchableOpacity,
  ViewProps,
  TextProps,
  ScrollViewProps,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView as RNSafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export function ThemedView({ style, ...props }: ViewProps) {
  const { colors } = useTheme();
  return <RNView {...props} style={[{ backgroundColor: colors.background }, style]} />;
}

export function ThemedSafeAreaView({ style, ...props }: SafeAreaViewProps) {
  const { colors } = useTheme();
  return <RNSafeAreaView {...props} style={[{ backgroundColor: colors.background }, style]} />;
}

export function ThemedScrollView({ style, contentContainerStyle, ...props }: ScrollViewProps) {
  const { colors } = useTheme();
  return (
    <RNScrollView
      {...props}
      style={[{ backgroundColor: colors.background }, style]}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

export function ThemedText({ style, ...props }: TextProps) {
  const { colors } = useTheme();
  return <RNText {...props} style={[{ color: colors.text }, style]} />;
}

export function ThemedTouchableOpacity({ style, ...props }: TouchableOpacityProps) {
  const { colors } = useTheme();
  return (
    <RNTouchableOpacity
      {...props}
      style={[styles.touchableBase, { backgroundColor: colors.card, borderColor: colors.border }, style]}
    />
  );
}

const styles = StyleSheet.create({
  touchableBase: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
  },
});
