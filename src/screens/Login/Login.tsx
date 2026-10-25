import { useRef, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Image,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '../../assets/images/logo.png';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { TextField } from '../../components/TextField/TextField';
import { Box } from '../../theme/restyle';
import { useLoginForm } from './useLoginForm';

const LOGO_SIZE = { width: 306, height: 49 };
const LOGO_TOP = 104;
const FIELD_INPUT_HEIGHT = 71;
const FIELD_GAP = 40;
const LOGO_TO_FIELDS = 76;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  logo: { ...LOGO_SIZE, marginTop: LOGO_TOP, alignSelf: 'center' },
  input: { height: FIELD_INPUT_HEIGHT },
  fields: { marginTop: LOGO_TO_FIELDS },
});

export function Login() {
  const { cpf, senha, setCpf, setSenha, canSubmit, loading, error, submit } =
    useLoginForm();
  const senhaRef = useRef<ComponentRef<typeof TextInput>>(null);
  const insets = useSafeAreaInsets();
  const onSubmit = () => {
    submit();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Box flex={1} backgroundColor="background">
        <Box flex={1}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
            accessible
            accessibilityRole="image"
            accessibilityLabel="FIAP School"
          />
          <Box marginHorizontal="xxl" style={styles.fields}>
            <TextField
              label="CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="number-pad"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => senhaRef.current?.focus()}
              style={styles.input}
            />
            <Box height={FIELD_GAP} />
            <TextField
              label="SENHA"
              ref={senhaRef}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={onSubmit}
              error={error ?? undefined}
              style={styles.input}
            />
          </Box>
        </Box>
        <Box backgroundColor="accent" style={{ paddingBottom: insets.bottom }}>
          <PrimaryButton
            label="FAZER LOGIN"
            onPress={onSubmit}
            disabled={!canSubmit}
            loading={loading}
          />
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
}
