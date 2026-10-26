import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSession } from '../../store/useSession';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import {
  guardianFirstName,
  studentFirstName,
  studentInfoLine,
} from '../../utils/student';
import { Text } from '../Text/Text';

export function StudentSummary() {
  const theme = useAppTheme();
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
      <Animated.View
        key={student.rm}
        testID="student-identity"
        entering={FadeIn.duration(motion.duration.transition)}
        exiting={FadeOut.duration(motion.duration.exit)}
        style={[
          styles.identity,
          { marginTop: theme.spacing.xl2, gap: theme.spacing.s },
        ]}
      >
        <Text variant="bodyMedium" accessibilityRole="header">
          {studentFirstName(student)}
        </Text>
        <Text variant="body">{studentInfoLine(student)}</Text>
      </Animated.View>
    </Box>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center' },
});
