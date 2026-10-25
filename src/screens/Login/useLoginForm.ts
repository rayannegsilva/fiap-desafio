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
  const [senha, setSenhaValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const canSubmit =
    cpf.replace(/\D/g, '').length === CPF_DIGITS && senha !== '' && !loading;

  const setCpf = (value: string) => {
    setError(null);
    setCpfValue(formatCpf(value));
  };

  const setSenha = (value: string) => {
    setError(null);
    setSenhaValue(value);
  };

  const submit = async () => {
    if (!canSubmit || inFlight.current) {
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const responsavel = await authenticate(cpf, senha);
      if (!responsavel) {
        setError(INVALID_CREDENTIALS);
      } else if (responsavel.alunos.length === 0) {
        setError(NO_STUDENTS);
      } else {
        signIn(responsavel.id, responsavel.alunos[0].rm);
      }
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };

  return {
    cpf,
    senha,
    setCpf,
    setSenha,
    canSubmit,
    loading,
    error,
    submit,
  };
}
