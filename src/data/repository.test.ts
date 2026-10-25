import { AUTH_DELAY_MS, authenticate, getGuardian } from './repository';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

async function auth(cpf: string, password: string) {
  const promise = authenticate(cpf, password);
  jest.advanceTimersByTime(AUTH_DELAY_MS);
  return promise;
}

it('authenticates with masked or raw cpf and never returns the password', async () => {
  const masked = await auth('969.294.560-04', '123456');
  expect(masked?.primeiroNome).toBe('Gustavo');
  expect(masked).not.toHaveProperty('senha');
  expect((await auth('96929456004', '123456'))?.id).toBe(1);
});

it('rejects wrong password or unknown cpf', async () => {
  expect(await auth('96929456004', '000000')).toBeNull();
  expect(await auth('11111111111', '123456')).toBeNull();
});

it('finds a guardian by id and returns null for unknown ids', () => {
  expect(getGuardian(2)?.alunos.map(a => a.primeiroNome)).toEqual(['Bianca']);
  expect(getGuardian(999)).toBeNull();
});
