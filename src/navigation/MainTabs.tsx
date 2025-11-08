import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

import CoinListScreen from '../screens/home/CoinsListScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import PortfolioScreen from '../screens/portfolio/PortfolioScreen';
import AlertsScreen from '../screens/alerts/AlertsScreen';
import SettingScreen from '../screens/settings/SettingScreen';
import CoinDetailsScreen from '../screens/home/CoinDetailsScreen';

const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNav() {
  const { colors } = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <HomeStack.Screen
        name="CoinList"
        component={CoinListScreen}
        options={{ title: 'Criptomoedas' }}
      />
      <HomeStack.Screen
        name="CoinDetails"
        component={CoinDetailsScreen}
        options={{ title: 'Detalhes' }}
      />
    </HomeStack.Navigator>
  );
}

export default function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tabs.Navigator
      // aplica tema no header, labels, ícones e na barra:
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 12 },

        // fundo da “área de conteúdo” de cada tab:
        sceneContainerStyle: { backgroundColor: colors.background },

        // ícones coerentes com o tema
        tabBarIcon: ({ color, size, focused }) => {
          let icon = 'ellipse';
          switch (route.name) {
            case 'Home':
              icon = focused ? 'home' : 'home-outline';
              break;
            case 'Favorites':
              icon = focused ? 'heart' : 'heart-outline';
              break;
            case 'Portfolio':
              icon = focused ? 'pie-chart' : 'pie-chart-outline';
              break;
            case 'Alerts':
              icon = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Settings':
              icon = focused ? 'settings' : 'settings-outline';
              break;
          }
          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeStackNav} />
      <Tabs.Screen name="Favorites" component={FavoritesScreen} />
      <Tabs.Screen name="Portfolio" component={PortfolioScreen} />
      <Tabs.Screen name="Alerts" component={AlertsScreen} />
      <Tabs.Screen name="Settings" component={SettingScreen} />
    </Tabs.Navigator>
  );
}
