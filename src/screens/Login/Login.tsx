import { useEffect, useRef, type ComponentRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Image,
  Platform,
  Pressable,
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
import { LOGO_SIZE, LOGO_TOP } from './loginLayout';
import { useLoginForm } from './useLoginForm';

const FIELD_INPUT_HEIGHT = 71;
const FIELD_GAP = 40;
const LOGO_TO_FIELDS = 76;

export function Login() {
  const {
    cpf,
    password,
    setCpf,
    setPassword,
    canSubmit,
    loading,
    error,
    submit,
  } = useLoginForm();

  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const keyboardVisible = useKeyboardVisible();

  useEffect(() => {
    if (keyboardVisible) scrollRef.current?.scrollToEnd({ animated: true });
  }, [keyboardVisible]);
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const footerStyle = { paddingBottom: keyboardVisible ? 0 : insets.bottom };

  const scrollPadding = {
    paddingBottom: keyboardVisible ? theme.spacing.l : 0,
  };
  const onSubmit = () => {
    submit();
  };

  return (
    <KeyboardAvoidingView
      testID="login-screen"
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior="padding"
    >
      <Box flex={1} backgroundColor="background">
        <Box flex={1}>
          <ScrollView
            ref={scrollRef}
            testID="login-scroll"
            contentContainerStyle={[styles.scroll, scrollPadding]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === 'ios' ? 'interactive' : 'on-drag'
            }
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              testID="login-dismiss-keyboard"
              accessible={false}
              onPress={Keyboard.dismiss}
              style={styles.dismiss}
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
                  keyboardType={
                    Platform.OS === 'ios'
                      ? 'numbers-and-punctuation'
                      : 'number-pad'
                  }
                  autoCorrect={false}
                  spellCheck={false}
                  autoComplete="off"
                  textContentType="none"
                  maxLength={14}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  style={styles.input}
                />
                <Box height={FIELD_GAP} />
                <TextField
                  label="SENHA"
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  error={error ?? undefined}
                  style={styles.input}
                />
              </Box>
            </Pressable>
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  logo: { ...LOGO_SIZE, marginTop: LOGO_TOP, alignSelf: 'center' },
  input: { height: FIELD_INPUT_HEIGHT },
  scroll: { flexGrow: 1 },
  dismiss: { flexGrow: 1 },
  fields: { marginTop: LOGO_TO_FIELDS },
});
