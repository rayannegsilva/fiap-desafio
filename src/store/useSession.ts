import { useEffect, useSyncExternalStore } from 'react';
import { getResponsavel } from '../data/repository';
import type { Aluno, Responsavel } from '../data/types';
import { useSessionStore } from './useSessionStore';

const subscribeHydration = (cb: () => void) => {
  const offHydrate = useSessionStore.persist.onHydrate(cb);
  const offFinish = useSessionStore.persist.onFinishHydration(cb);
  return () => {
    offHydrate();
    offFinish();
  };
};

export function useSessionHydrated(): boolean {
  return useSyncExternalStore(subscribeHydration, () =>
    useSessionStore.persist.hasHydrated(),
  );
}

export function useSession(): {
  responsavel: Responsavel;
  aluno: Aluno;
} | null {
  const responsavelId = useSessionStore(s => s.responsavelId);
  const alunoRm = useSessionStore(s => s.alunoRm);
  const signOut = useSessionStore(s => s.signOut);

  const responsavel =
    responsavelId === null ? null : getResponsavel(responsavelId);
  const aluno = responsavel?.alunos.find(a => a.rm === alunoRm) ?? null;
  const orphan = responsavelId !== null && !(responsavel && aluno);

  useEffect(() => {
    if (orphan) {
      signOut();
    }
  }, [orphan, signOut]);

  return responsavel && aluno ? { responsavel, aluno } : null;
}
