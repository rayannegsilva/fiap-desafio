import { ScrollView } from 'react-native';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { StudentSummary } from '../../components/StudentSummary/StudentSummary';
import { Text } from '../../components/Text/Text';
import { Box } from '../../theme/restyle';
import { reportCardLabel } from '../../utils/reportCard';
import { TermCard } from './TermCard';
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
              <TermCard key={term.trimestre} term={term} index={index} />
            ))}
          </Box>
        </Box>
      ) : null}
    </ScrollView>
  );
}
