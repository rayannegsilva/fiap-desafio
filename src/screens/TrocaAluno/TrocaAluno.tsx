import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePressScale } from '../../animations/usePressScale';
import Close from '../../assets/icons/close.svg';
import { Text } from '../../components/Text/Text';
import { TextButton } from '../../components/TextButton/TextButton';
import type { Aluno } from '../../data/types';
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
  aluno: Aluno;
  selected: boolean;
  onPress: () => void;
};

function AlunoCard({ aluno, selected, onPress }: CardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={studentFullName(aluno)}
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
          <Text variant="bodyMedium">{studentFullName(aluno)}</Text>
          <Text variant="body">{studentInfoLine(aluno)}</Text>
        </Box>
      </Animated.View>
    </Pressable>
  );
}

export function TrocaAluno() {
  const navigation = useNavigation();
  const session = useSession();
  const selectAluno = useSessionStore(s => s.selectAluno);
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
        {session.responsavel.alunos.map(aluno => (
          <AlunoCard
            key={aluno.rm}
            aluno={aluno}
            selected={aluno.rm === session.aluno.rm}
            onPress={() => {
              selectAluno(aluno.rm);
              navigation.goBack();
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
