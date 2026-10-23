import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../routes/types';
import { Box, Text } from '../../theme/restyle';

export function Login() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Box
      flex={1}
      backgroundColor="background"
      justifyContent="center"
      alignItems="center"
    >
      <Text variant="screenTitle">Login</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Entrar (temporário)"
        onPress={() => navigation.navigate('Main')}
      >
        <Text variant="body" color="accentText">
          Entrar
        </Text>
      </Pressable>
    </Box>
  );
}
