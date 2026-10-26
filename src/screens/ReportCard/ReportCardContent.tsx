import { ScrollView } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { StudentSummary } from '../../components/StudentSummary/StudentSummary';
import { Text } from '../../components/Text/Text';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { reportCardLabel } from '../../utils/reportCard';
import { TermCard } from './TermCard';
import { useReportCard } from './useReportCard';

export function ReportCardContent() {
  const theme = useAppTheme();
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
          <Animated.View
            key={listKey}
            testID="report-card-list"
            exiting={FadeOut.duration(motion.duration.exit)}
            style={{ marginTop: theme.spacing.m, gap: theme.spacing.m }}
          >
            {selected.trimestres.map((term, index) => (
              <TermCard key={term.trimestre} term={term} index={index} />
            ))}
          </Animated.View>
        </Box>
      ) : null}
    </ScrollView>
  );
}
