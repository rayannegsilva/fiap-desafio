import { useState } from 'react';
import type { ScheduleDay } from '../../data/types';
import { useSession } from '../../store/useSession';
import { initialDay } from '../../utils/schedule';

export function useSchedule() {
  const session = useSession();
  const [chosen, setChosen] = useState<string | null>(null);

  const days = session?.student.agenda ?? [];
  const selectedDay =
    days.find(d => d.dia === chosen) ?? initialDay(days, new Date());

  return {
    days,
    selectedDay,
    selectDay: (day: ScheduleDay) => setChosen(day.dia),
  };
}
