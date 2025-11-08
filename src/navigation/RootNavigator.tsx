import React from 'react';
import { NavigationContainer,DarkTheme, DefaultTheme } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';


export default function RootNavigator() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const dark = useSettingsStore((s) => s.darkMode);
  const isAuth = !!accessToken;

  return (
    <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
      {isAuth ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
