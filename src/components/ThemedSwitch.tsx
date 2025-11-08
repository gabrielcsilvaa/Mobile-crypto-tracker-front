import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function ThemedSwitch(props: SwitchProps) {
  const { colors } = useTheme();
  return (
    <Switch
      {...props}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={props.value ? colors.card : colors.card}
    />
  );
}
