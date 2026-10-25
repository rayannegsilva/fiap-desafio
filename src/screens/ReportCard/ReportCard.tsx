import { Header } from '../../components/Header/Header';
import { useSession } from '../../store/useSession';
import { Box } from '../../theme/restyle';
import { ReportCardContent } from './ReportCardContent';

export function ReportCard() {
  const session = useSession();

  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <ReportCardContent key={session?.student.rm ?? 'none'} />
    </Box>
  );
}
