# 📱 CryptoTracker (Frontend)

> App mobile (Android, IOS) para rastrear criptomoedas, gerir portfólio e alertas de preço.

Este repositório contém o frontend em React Native/Expo, integrado ao backend Django/DRF.

## ✨ Principais recursos

- ✅ Autenticação completa (login/registro/refresh) com interceptors
- 📋 Lista de moedas com paginação infinita e busca
- 📊 Gráficos históricos e estatísticas detalhadas
- ❤️ Sistema de favoritos sincronizado
- 💼 Portfólio com cálculo de P/L
- 🔔 Alertas de preço personalizados
- 🌓 Tema claro/escuro global

## 🧱 Stack

- **React Native** (Expo)
- **TypeScript**
- **React Navigation** v6 (Bottom Tabs + Stacks)
- **TanStack Query** v5
- **Zustand** (auth/settings state)
- **Axios** (com interceptors JWT)
- **Victory Native** (gráficos)
- **MMKV** (persistência)

## 📁 Estrutura do projeto

```
.
├─ assets/ # ícones, fontes e imagens
├─ src/
│ ├─ api/
│ │ ├─ axios.ts # instancia do Axios + interceptors (JWT/refresh)
│ │ └─ endpoints.ts # rotas do backend (auth, coins, favorites, portfolio, alerts)
│ ├─ components/
│ │ ├─ CoinCard.tsx # card da moeda (nome, símbolo, preço, variação, fav)
│ │ ├─ Chart.tsx # gráfico de preço (days: 7/30/90/365/max)
│ │ └─ HomePortfolioSummary.tsx # resumo do portfólio no topo da Home
│ ├─ hooks/
│ │ ├─ useCoins.ts # lista/paginação/busca de moedas
│ │ ├─ useCoinDetails.ts # detalhes da moeda
│ │ ├─ useCoinChart.ts # série histórica p/ gráfico
│ │ ├─ useFavorites.ts # favoritos (query + mutations add/remove)
│ │ ├─ usePortfolio.ts # holdings + add/update/remove
│ │ └─ useAlerts.ts # alertas: list/create/remove
│ ├─ navigation/
│ │ ├─ MainTabs.tsx # tabs: Home, Favorites, Portfolio, Alerts, Settings
│ │ └─ AuthStack.tsx # rota para login e register
│ │ └─ RootNavigation.tsx # apenas verificaçao de token e logado, caso esteja logado vá para o mainTabs
│ ├─ screens/
│ │ ├─ home/
│ │ │ ├─ CoinsListScreen.tsx # FlatList c/ paginação, busca, resumo do portfólio
│ │ │ └─ CoinDetailsScreen.tsx
│ │ ├─ favorites/FavoritesScreen.tsx
│ │ ├─ portfolio/PortfolioScreen.tsx
│ │ ├─ alerts/AlertsScreen.tsx
│ │ └─ settings/SettingScreen.tsx
│ ├─ store/
│ │ ├─ authStore.ts # tokens, user, login/logout/setTokens
│ │ └─ settingsStore.ts # darkMode + toggle
│ ├─ theme/ # helpers de tema, tipografia, cores
│ └─ utils/ # formatadores (número, moeda, datas)
│
├─ App.tsx # registra NavigationContainer, QueryClientProvider, tema, etc.
├─ index.ts # entry Expo
├─ app.config.ts # Expo config (android.package)
├─ app.json # metadados (nome, ícones, etc.)
├─ package.json # dependências/scripts
├─ tsconfig.json # TS config
└─ .env # variáveis (API_URL) - não commitar segredos
```

## 🚀 Como rodar

1. **Instalar dependências**
```bash
npm install
# ou
yarn
```

2. **Configurar .env**
```env
API_URL=http://10.0.2.2:3000  # Emulador
# ou
API_URL=http://SEU_IPV4:3000    # Device físico
```

3. **Rodar o app**
```bash
npx expo start --tunnel
```

## 🔌 Endpoints principais

```typescript
const endpoints = {
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    refresh: '/auth/refresh/',
  },
  coins: {
    list: '/coins/',
    details: (id: string) => `/coins/${id}/`,
    chart: (id: string) => `/coins/${id}/chart/`,
  },
}
```

## 📸 Screenshots

### 🏠 Home
![Home Screen](./assets/HomeCrypto.jpg)

### 📈 Detalhes da Moeda
![Coin Details](./assets/DetailsCrypto.jpg)

### 💼 Portfólio
![Portfolio](./assets/PortfolioCrypto.jpg)

### 🔔 Alertas
![Alerts](./assets/AlertsCrypto.jpg)

## 🛣️ Roadmap

- [ ] Push notifications (FCM)
- [ ] Deep linking
- [ ] Autenticação biométrica
- [ ] Testes E2E
- [ ] Melhorias de acessibilidade

## 📝 Licença

MIT

---
Desenvolvido por [Gabriel Cardoso Da silva]
