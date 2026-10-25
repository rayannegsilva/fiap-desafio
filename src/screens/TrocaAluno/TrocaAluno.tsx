import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePressScale } from '../../animations/usePressScale';
import Close from '../../assets/icons/close.svg';
import { Text } from '../../components/Text/Text';
import { TextButton } from '../../components/TextButton/TextButton';
import type { Student } from '../../data/types';
import { useSession } from '../../store/useSession';
import { useSessionStore } from '../../store/useSessionStore';
import { Box } from '../../theme/restyle';
import { studentFullName, studentInfoLine } from '../../utils/student';

const CLOSE_ICON_SIZE = 24;
const CARD_HEIGHT = 90;
const TITLE_TOP = 153;
const CARDS_TOP = 64;
const SELECTED_BORDER = 2;

type CardProps = {
  student: Student;
  selected: boolean;
  onPress: () => void;
};

function AlunoCard({ student, selected, onPress }: CardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={studentFullName(student)}
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={animatedStyle}>
        <Box
          height={CARD_HEIGHT}
          padding="m"
          justifyContent="space-between"
          backgroundColor="surfaceRaised"
          borderRadius="default"
          borderWidth={selected ? SELECTED_BORDER : 0}
          borderColor="accent"
        >
          <Text variant="bodyMedium">{studentFullName(student)}</Text>
          <Text variant="body">{studentInfoLine(student)}</Text>
        </Box>
      </Animated.View>
    </Pressable>
  );
}

export function TrocaAluno() {
  const navigation = useNavigation();
  const session = useSession();
  const selectStudent = useSessionStore(s => s.selectStudent);
  const insets = useSafeAreaInsets();

  if (!session) {
    return null;
  }

  return (
    <Box
      flex={1}
      backgroundColor="background"
      style={{ paddingTop: insets.top }}
    >
      <Box alignItems="flex-end" padding="m">
        <TextButton
          label="FECHAR"
          variant="cardTitle"
          icon={Close}
          iconSize={CLOSE_ICON_SIZE}
          onPress={navigation.goBack}
        />
      </Box>
      <Box paddingHorizontal="xxl" style={{ marginTop: TITLE_TOP }}>
        <Text variant="screenTitle" textAlign="center">
          Escolha o perfil que você quer visualizar
        </Text>
      </Box>
      <Box paddingHorizontal="m" gap="m" style={{ marginTop: CARDS_TOP }}>
        {session.guardian.alunos.map(student => (
          <AlunoCard
            key={student.rm}
            student={student}
            selected={student.rm === session.student.rm}
            onPress={() => {
              selectStudent(student.rm);
              navigation.goBack();
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
