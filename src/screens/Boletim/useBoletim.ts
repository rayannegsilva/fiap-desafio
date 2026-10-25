import { useState } from 'react';
import type { ReportCard } from '../../data/types';
import { useSession } from '../../store/useSession';

export function useBoletim() {
  const session = useSession();
  const [chosen, setChosen] = useState<string | null>(null);

  const student = session?.student ?? null;
  const boletins = [...(student?.boletim ?? [])].sort((a, b) =>
    b.ano.localeCompare(a.ano),
  );
  const rm = student?.rm ?? null;

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
    selectBoletim: (b: ReportCard) => setChosen(b.ano),
    listKey: rm && selected ? `${rm}-${selected.ano}` : '',
  };
}
