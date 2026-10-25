import { useEffect } from 'react';
import { getGuardian } from '../data/repository';
import type { Student, Guardian } from '../data/types';
import { useSessionStore } from './useSessionStore';

export function useSessionHydrated(): boolean {
  return useSessionStore(s => s.hydrated);
}

export function useSession(): {
  guardian: Guardian;
  student: Student;
} | null {
  const guardianId = useSessionStore(s => s.guardianId);
  const studentRm = useSessionStore(s => s.studentRm);
  const signOut = useSessionStore(s => s.signOut);

  const guardian = guardianId === null ? null : getGuardian(guardianId);
  const student = guardian?.alunos.find(a => a.rm === studentRm) ?? null;
  const orphan = guardianId !== null && !(guardian && student);

  useEffect(() => {
    if (orphan) {
      signOut();
    }
  }, [orphan, signOut]);

  return guardian && student ? { guardian, student } : null;
}
