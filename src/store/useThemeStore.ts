import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeState = {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'dark',
      toggleTheme: () =>
        set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'theme-storage', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
