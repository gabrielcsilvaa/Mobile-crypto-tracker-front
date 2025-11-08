// src/screens/settings/SettingsScreen.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { ThemedText, ThemedView } from '../../components/Themed';
import ThemedSwitch from '../../components/ThemedSwitch';
import ThemedScreen from '../../components/ThemedScreen';

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode } = useSettingsStore();
  const { logout, user } = useAuthStore();

  return (
    <ThemedScreen>
      <ThemedText style={{ fontSize: 22, fontWeight: '800' }}>Configurações</ThemedText>

      <ThemedView style={{ marginTop: 12, gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText>Dark mode</ThemedText>
          <ThemedSwitch value={darkMode} onValueChange={toggleDarkMode} />
        </View>

        {user && <Button title="Sair" onPress={logout} />}
      </ThemedView>
    </ThemedScreen>
  );
}
