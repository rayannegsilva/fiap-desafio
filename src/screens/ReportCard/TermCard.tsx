import Animated from 'react-native-reanimated';
import { useFocusEntrance } from '../../animations/useFocusEntrance';
import { Collapsible } from '../../components/Collapsible/Collapsible';
import type { ReportCard } from '../../data/types';
import { subjectLabel, termLabel } from '../../utils/reportCard';
import { SubjectDetails } from './SubjectDetails';

type Props = { term: ReportCard['trimestres'][number]; index: number };

export function TermCard({ term, index }: Props) {
  const style = useFocusEntrance(index);

  return (
    <Animated.View style={style}>
      <Collapsible variant="card" title={termLabel(term.trimestre)}>
        {term.disciplinas.map(subject => (
          <Collapsible
            key={subject.nome}
            variant="row"
            title={subjectLabel(subject.nome)}
          >
            <SubjectDetails subject={subject} />
          </Collapsible>
        ))}
      </Collapsible>
    </Animated.View>
  );
}
