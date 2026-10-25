import { act, renderHook } from '@testing-library/react-native';
import * as repository from '../../data/repository';
import { useSessionStore } from '../../store/useSessionStore';
import { useLoginForm } from './useLoginForm';

beforeEach(() => {
  jest.useFakeTimers();
  useSessionStore.setState({ responsavelId: null, alunoRm: null });
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

async function fill(
  result: { current: ReturnType<typeof useLoginForm> },
  cpf: string,
  senha: string,
) {
  await act(() => result.current.setCpf(cpf));
  await act(() => result.current.setSenha(senha));
}

it('masks the cpf as it is typed', async () => {
  const { result } = await renderHook(() => useLoginForm());
  await act(() => result.current.setCpf('96929456004'));
  expect(result.current.cpf).toBe('969.294.560-04');
});

it('keeps submit disabled until cpf has 11 digits and password is filled', async () => {
  const { result } = await renderHook(() => useLoginForm());
  await fill(result, '9692945600', '123456');
  expect(result.current.canSubmit).toBe(false);
  await fill(result, '96929456004', '');
  expect(result.current.canSubmit).toBe(false);
  await fill(result, '96929456004', '123456');
  expect(result.current.canSubmit).toBe(true);
});

it('signs in with the first student on success', async () => {
  const { result } = await renderHook(() => useLoginForm());
  await fill(result, '96929456004', '123456');
  await act(async () => {
    const pending = result.current.submit();
    await jest.advanceTimersByTimeAsync(repository.AUTH_DELAY_MS);
    await pending;
  });
  expect(useSessionStore.getState()).toMatchObject({
    responsavelId: 1,
    alunoRm: 12567,
  });
  expect(result.current.loading).toBe(false);
});

it('shows the generic error on failure and clears it when a field changes', async () => {
  const { result } = await renderHook(() => useLoginForm());
  await fill(result, '96929456004', 'errada');
  await act(async () => {
    const pending = result.current.submit();
    await jest.advanceTimersByTimeAsync(repository.AUTH_DELAY_MS);
    await pending;
  });
  expect(result.current.error).toBe(
    'Usuário ou senha inválida. Pode tentar novamente?',
  );
  expect(useSessionStore.getState().responsavelId).toBeNull();
  await act(() => result.current.setSenha('errad'));
  expect(result.current.error).toBeNull();
});

it('reports a guardian without students', async () => {
  jest.spyOn(repository, 'authenticate').mockResolvedValue({
    id: 9,
    cpf: '96929456004',
    email: 'x@y.z',
    primeiroNome: 'A',
    sobrenome: 'B',
    alunos: [],
  });
  const { result } = await renderHook(() => useLoginForm());
  await fill(result, '96929456004', '123456');
  await act(() => result.current.submit());
  expect(result.current.error).toBe(
    'Nenhum aluno vinculado a este responsável.',
  );
  expect(useSessionStore.getState().responsavelId).toBeNull();
});

it('authenticates only once when submit is called twice while loading', async () => {
  const spy = jest.spyOn(repository, 'authenticate');
  const { result } = await renderHook(() => useLoginForm());
  await fill(result, '96929456004', '123456');
  await act(async () => {
    const first = result.current.submit();
    const second = result.current.submit();
    await jest.advanceTimersByTimeAsync(repository.AUTH_DELAY_MS);
    await Promise.all([first, second]);
  });
  expect(spy).toHaveBeenCalledTimes(1);
});
