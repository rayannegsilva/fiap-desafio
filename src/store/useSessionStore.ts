import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionState = {
  guardianId: number | null;
  studentRm: number | null;
  signIn: (guardianId: number, studentRm: number) => void;
  selectStudent: (rm: number) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      guardianId: null,
      studentRm: null,
      signIn: (guardianId, studentRm) => set({ guardianId, studentRm }),
      selectStudent: rm => set({ studentRm: rm }),
      signOut: () => set({ guardianId: null, studentRm: null }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ guardianId, studentRm }) => ({ guardianId, studentRm }),
    },
  ),
);
