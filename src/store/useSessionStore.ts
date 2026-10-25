import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionState = {
  responsavelId: number | null;
  alunoRm: number | null;
  signIn: (responsavelId: number, alunoRm: number) => void;
  selectAluno: (rm: number) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      responsavelId: null,
      alunoRm: null,
      signIn: (responsavelId, alunoRm) => set({ responsavelId, alunoRm }),
      selectAluno: rm => set({ alunoRm: rm }),
      signOut: () => set({ responsavelId: null, alunoRm: null }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ responsavelId, alunoRm }) => ({ responsavelId, alunoRm }),
    },
  ),
);
