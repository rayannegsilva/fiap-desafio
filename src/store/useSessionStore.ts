import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { motion } from '../theme/motion';

let switchTimer: ReturnType<typeof setTimeout> | undefined;

type SessionState = {
  hydrated: boolean;
  guardianId: number | null;
  studentRm: number | null;
  switching: boolean;
  signIn: (guardianId: number, studentRm: number) => void;
  selectStudent: (rm: number) => void;
  switchStudent: (rm: number) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      hydrated: false,
      guardianId: null,
      studentRm: null,
      switching: false,
      signIn: (guardianId, studentRm) => set({ guardianId, studentRm }),
      selectStudent: rm => set({ studentRm: rm }),
      switchStudent: rm => {
        clearTimeout(switchTimer);
        set({ studentRm: rm, switching: true });
        switchTimer = setTimeout(
          () => set({ switching: false }),
          motion.duration.skeleton,
        );
      },
      signOut: () => set({ guardianId: null, studentRm: null }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ guardianId, studentRm }) => ({ guardianId, studentRm }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          useSessionStore.setState({ guardianId: null, studentRm: null });
          useSessionStore.persist.clearStorage();
        }
        useSessionStore.setState({ hydrated: true });
      },
    },
  ),
);
