import { ScrollView } from 'react-native';
import { Header } from '../../components/Header/Header';
import { StudentSummary } from '../../components/StudentSummary/StudentSummary';
import { Text } from '../../components/Text/Text';
import { useSession } from '../../store/useSession';
import { useSessionStore } from '../../store/useSessionStore';
import { Box } from '../../theme/restyle';
import { ReportCardContent } from './ReportCardContent';
import { ReportCardSkeleton } from './ReportCardSkeleton';

export function ReportCard() {
  const session = useSession();
  const switching = useSessionStore(s => s.switching);

  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      {switching ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <StudentSummary />
          <Text
            variant="sectionTitle"
            textAlign="center"
            marginTop="xxl"
            accessibilityRole="header"
          >
            BOLETIM
          </Text>
          <ReportCardSkeleton />
        </ScrollView>
      ) : (
        <ReportCardContent key={session?.student.rm ?? 'none'} />
      )}
    </Box>
  );
}
