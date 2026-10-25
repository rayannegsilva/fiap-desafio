import { useEffect, useRef, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '../../assets/images/logo.png';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { TextField } from '../../components/TextField/TextField';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
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
  scroll: { flexGrow: 1 },
  fields: { marginTop: LOGO_TO_FIELDS },
});

export function Login() {
  const { cpf, senha, setCpf, setSenha, canSubmit, loading, error, submit } =
    useLoginForm();
  const senhaRef = useRef<ComponentRef<typeof TextInput>>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const keyboardVisible = useKeyboardVisible();
  useEffect(() => {
    if (keyboardVisible) scrollRef.current?.scrollToEnd({ animated: true });
  }, [keyboardVisible]);
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const footerStyle = { paddingBottom: keyboardVisible ? 0 : insets.bottom };
  // keeps SENHA off the button while the keyboard is open
  const scrollPadding = {
    paddingBottom: keyboardVisible ? theme.spacing.l : 0,
  };
  const onSubmit = () => {
    submit();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      // with edge-to-edge Android doesn't resize the window, so the view must pad itself on both platforms
      behavior="padding"
    >
      <Box flex={1} backgroundColor="background">
        <Box flex={1}>
          <ScrollView
            ref={scrollRef}
            testID="login-scroll"
            contentContainerStyle={[styles.scroll, scrollPadding]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={keyboardVisible}
          >
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
                // iOS number-pad has no return key; this one does (mask keeps digits only)
                keyboardType={
                  Platform.OS === 'ios'
                    ? 'numbers-and-punctuation'
                    : 'number-pad'
                }
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
          </ScrollView>
        </Box>
        <Box testID="login-footer" backgroundColor="accent" style={footerStyle}>
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
