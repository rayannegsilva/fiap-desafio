import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logout from '../../assets/icons/logout.svg';
import logo from '../../assets/images/logo.png';
import type { RootStackParamList } from '../../routes/types';
import { useSession } from '../../store/useSession';
import { useSessionStore } from '../../store/useSessionStore';
import { Box } from '../../theme/restyle';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { TextButton } from '../TextButton/TextButton';

const ACTION_BAR_HEIGHT = 48;
const LOGO_SIZE = { width: 100, height: 16 };
const LOGOUT_ICON_SIZE = 10;

export function Header() {
  const session = useSession();
  const signOut = useSessionStore(s => s.signOut);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  if (!session) {
    return null;
  }
  const { guardian } = session;

  return (
    <Box backgroundColor="background" style={{ paddingTop: insets.top }}>
      <Box
        height={ACTION_BAR_HEIGHT}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="m"
      >
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
          accessible
          accessibilityRole="image"
          accessibilityLabel="FIAP School"
        />
        <Box flexDirection="row" alignItems="center" gap="l">
          {guardian.alunos.length > 1 ? (
            <TextButton
              label="TROCAR PERFIL"
              onPress={() => navigation.navigate('StudentSwitch')}
            />
          ) : null}
          <TextButton
            label="SAIR"
            onPress={() => setConfirmingSignOut(true)}
            icon={Logout}
            iconSize={LOGOUT_ICON_SIZE}
          />
        </Box>
      </Box>
      <ConfirmDialog
        visible={confirmingSignOut}
        title="Sair da conta?"
        message="Você vai precisar entrar de novo com CPF e senha."
        confirmLabel="SAIR"
        cancelLabel="CANCELAR"
        confirmIcon={Logout}
        onConfirm={() => {
          setConfirmingSignOut(false);
          signOut();
        }}
        onCancel={() => setConfirmingSignOut(false)}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  logo: LOGO_SIZE,
});
