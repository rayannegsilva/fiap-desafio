import guardiansJson from './responsaveis.json';
import type { Guardian } from './types';

export const AUTH_DELAY_MS = 600;

type GuardianRecord = Guardian & { senha: string };

const records = guardiansJson as GuardianRecord[];

const onlyDigits = (value: string) => value.replace(/\D/g, '');

function toGuardian({ senha: _senha, ...guardian }: GuardianRecord): Guardian {
  return guardian;
}

export function authenticate(
  cpf: string,
  password: string,
): Promise<Guardian | null> {
  const found = records.find(
    r => r.cpf === onlyDigits(cpf) && r.senha === password,
  );
  return new Promise(resolve => {
    setTimeout(() => resolve(found ? toGuardian(found) : null), AUTH_DELAY_MS);
  });
}

export function getGuardian(id: number): Guardian | null {
  const found = records.find(r => r.id === id);
  return found ? toGuardian(found) : null;
}
