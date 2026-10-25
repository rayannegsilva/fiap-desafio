import { useRef, useState } from 'react';
import { authenticate } from '../../data/repository';
import { useSessionStore } from '../../store/useSessionStore';
import { formatCpf } from '../../utils/formatCpf';

const CPF_DIGITS = 11;
const INVALID_CREDENTIALS = 'Usuário ou senha inválida. Pode tentar novamente?';
const NO_STUDENTS = 'Nenhum aluno vinculado a este responsável.';

export function useLoginForm() {
  const signIn = useSessionStore(s => s.signIn);
  const [cpf, setCpfValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const canSubmit =
    cpf.replace(/\D/g, '').length === CPF_DIGITS && password !== '' && !loading;

  const setCpf = (value: string) => {
    setError(null);
    setCpfValue(formatCpf(value));
  };

  const setPassword = (value: string) => {
    setError(null);
    setPasswordValue(value);
  };

  const submit = async () => {
    if (!canSubmit || inFlight.current) {
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const guardian = await authenticate(cpf, password);
      if (!guardian) {
        setError(INVALID_CREDENTIALS);
      } else if (guardian.alunos.length === 0) {
        setError(NO_STUDENTS);
      } else {
        signIn(guardian.id, guardian.alunos[0].rm);
      }
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };

  return {
    cpf,
    password,
    setCpf,
    setPassword,
    canSubmit,
    loading,
    error,
    submit,
  };
}
