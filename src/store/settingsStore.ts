import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  getString: async (key: string) => AsyncStorage.getItem(key),
  set: async (key: string, value: string) => AsyncStorage.setItem(key, value),
  remove: async (key: string) => AsyncStorage.removeItem(key),
};

type SettingsState = { darkMode: boolean; toggleDarkMode: () => void };

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => ({
        getItem: (k) => storage.getString(k),
        setItem: (k, v) => storage.set(k, v),
        removeItem: (k) => storage.remove(k),
      })),
    }
  )
);
