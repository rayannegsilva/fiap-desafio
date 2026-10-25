import { useState } from 'react';
import type { Boletim } from '../../data/types';
import { useSession } from '../../store/useSession';

export function useBoletim() {
  const session = useSession();
  const [chosen, setChosen] = useState<string | null>(null);

  const aluno = session?.aluno ?? null;
  const boletins = [...(aluno?.boletim ?? [])].sort((a, b) =>
    b.ano.localeCompare(a.ano),
  );
  const rm = aluno?.rm ?? null;

  // Switching student drops the choice (state reset during render).
  const [chosenRm, setChosenRm] = useState(rm);
  if (chosenRm !== rm) {
    setChosenRm(rm);
    setChosen(null);
  }

  const selected = boletins.find(b => b.ano === chosen) ?? boletins[0] ?? null;

  return {
    boletins,
    selected,
    selectBoletim: (b: Boletim) => setChosen(b.ano),
    listKey: rm && selected ? `${rm}-${selected.ano}` : '',
  };
}
