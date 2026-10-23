import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../routes/types';
import { Box, Text } from '../../theme/restyle';

export function Aulas() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Box
      flex={1}
      backgroundColor="background"
      justifyContent="center"
      alignItems="center"
    >
      <Text variant="screenTitle">Aulas</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Trocar aluno (temporário)"
        onPress={() => navigation.navigate('TrocaAluno')}
      >
        <Text variant="body" color="accentText">
          Trocar aluno
        </Text>
      </Pressable>
    </Box>
  );
}
