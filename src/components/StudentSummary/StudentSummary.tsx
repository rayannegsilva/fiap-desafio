import { useSession } from '../../store/useSession';
import { Box } from '../../theme/restyle';
import {
  guardianFirstName,
  studentFirstName,
  studentInfoLine,
} from '../../utils/student';
import { Text } from '../Text/Text';

export function StudentSummary() {
  const session = useSession();

  if (!session) {
    return null;
  }
  const { guardian, student } = session;

  return (
    <Box alignItems="center" paddingTop="m" paddingBottom="m">
      <Text variant="greeting">
        Olá, <Text variant="greetingName">{guardianFirstName(guardian)}</Text>
      </Text>
      <Box marginTop="xl2" alignItems="center" gap="s">
        <Text variant="bodyMedium" accessibilityRole="header">
          {studentFirstName(student)}
        </Text>
        <Text variant="body">{studentInfoLine(student)}</Text>
      </Box>
    </Box>
  );
}
