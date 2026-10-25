import { ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Collapsible } from '../../components/Collapsible/Collapsible';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { StudentSummary } from '../../components/StudentSummary/StudentSummary';
import { Text } from '../../components/Text/Text';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import {
  reportCardLabel,
  subjectLabel,
  termLabel,
} from '../../utils/reportCard';
import { SubjectDetails } from './SubjectDetails';
import { useReportCard } from './useReportCard';

export function ReportCardContent() {
  const { reportCards, selected, selectReportCard, listKey } = useReportCard();

  return (
    <ScrollView
      testID="report-card-scroll"
      showsVerticalScrollIndicator={false}
    >
      <StudentSummary />
      <Text
        variant="sectionTitle"
        textAlign="center"
        marginTop="xxl"
        accessibilityRole="header"
      >
        BOLETIM
      </Text>
      {selected ? (
        <Box marginTop="m" marginHorizontal="m" paddingBottom="m">
          <Dropdown
            options={reportCards}
            selected={selected}
            onSelect={selectReportCard}
            getLabel={reportCardLabel}
            getKey={reportCard => reportCard.ano}
            accessibilityLabel="Ano do boletim"
          />
          <Box key={listKey} marginTop="m" gap="m">
            {selected.trimestres.map((term, index) => (
              <Animated.View
                key={term.trimestre}
                entering={FadeInDown.duration(motion.duration.transition).delay(
                  index * motion.stagger,
                )}
              >
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
            ))}
          </Box>
        </Box>
      ) : null}
    </ScrollView>
  );
}
