import 'react-native-gesture-handler';           
import 'react-native-reanimated';

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettingsStore } from './src/store/settingsStore';

const client = new QueryClient();

export default function App() {
  const dark = useSettingsStore((s) => s.darkMode);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={client}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
