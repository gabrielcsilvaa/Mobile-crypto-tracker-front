import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useAuthStore } from "../store/authStore";
import { endpoints } from "./endpoints";

// 1) Lê do app.config.ts -> extra.apiUrl (alimentado por EXPO_PUBLIC_API_URL)
const CFG_URL =
  (Constants as any)?.expoConfig?.extra?.API_URL||
  (Constants as any)?.manifest?.extra?.API_URL;
  

// 2) Fallbacks úteis para dev
const FALLBACK_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const API_URL: string = CFG_URL || FALLBACK_URL;
console.log("API_URL RESOLVIDA:", API_URL);

// Cliente principal (com interceptors)
export const api = axios.create({
  baseURL: API_URL,
  timeout: 25000,
});

// Cliente “limpo” só para o refresh (sem interceptors para evitar loop)
const plain = axios.create({
  baseURL: API_URL,
  timeout: 25000,
});

// 3) Injeta o Bearer com headers mergeados
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    // Se já for AxiosHeaders, usa .set()
    if (config.headers?.set) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      // fallback se for undefined ou objeto simples
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }
  return config;
});

// 4) Refresh token seguro
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = (error.response && error.response.status) || 0;

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      try {
        const { refreshToken, setTokens, logout } = useAuthStore.getState();
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        // chama o refresh sem interceptors
        const { data } = await plain.post(endpoints.auth.refresh, { refresh: refreshToken });
        const newAccess = (data as any)?.access;

        if (!newAccess) {
          // se o backend usa outra chave, ajuste aqui
          logout();
          return Promise.reject(error);
        }

        setTokens(newAccess, refreshToken);

        // reenvia a original com o novo access
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: `Bearer ${newAccess}`,
        };

        return api(original);
      } catch (e) {
        useAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
