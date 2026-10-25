import { useState } from 'react';
import type { ReportCard } from '../../data/types';
import { useSession } from '../../store/useSession';

export function useReportCard() {
  const session = useSession();
  const [chosen, setChosen] = useState<string | null>(null);

  const student = session?.student ?? null;
  const reportCards = [...(student?.boletim ?? [])].sort((a, b) =>
    b.ano.localeCompare(a.ano),
  );
  const rm = student?.rm ?? null;

  // Switching student drops the choice (state reset during render).
  const [chosenRm, setChosenRm] = useState(rm);
  if (chosenRm !== rm) {
    setChosenRm(rm);
    setChosen(null);
  }

  const selected =
    reportCards.find(b => b.ano === chosen) ?? reportCards[0] ?? null;

  return {
    reportCards,
    selected,
    selectReportCard: (b: ReportCard) => setChosen(b.ano),
    listKey: rm && selected ? `${rm}-${selected.ano}` : '',
  };
}
