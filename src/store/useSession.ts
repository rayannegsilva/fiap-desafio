import { useEffect, useState } from 'react';
import { getResponsavel } from '../data/repository';
import type { Aluno, Responsavel } from '../data/types';
import { useSessionStore } from './useSessionStore';

export function useSessionHydrated() {
  const [hydrated, setHydrated] = useState(
    useSessionStore.persist.hasHydrated(),
  );
  useEffect(
    () => useSessionStore.persist.onFinishHydration(() => setHydrated(true)),
    [],
  );
  return hydrated;
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
