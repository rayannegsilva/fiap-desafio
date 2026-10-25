import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeState = {
  mode: 'system' | 'light' | 'dark';
  setMode: (mode: ThemeState['mode']) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      mode: 'system',
      setMode: mode => set({ mode }),
    }),
    { name: 'theme-storage', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
