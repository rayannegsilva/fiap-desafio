import responsaveisJson from './responsaveis.json';
import type { Responsavel } from './types';

export const AUTH_DELAY_MS = 600;

type Registro = Responsavel & { senha: string };

const registros = responsaveisJson as Registro[];

const onlyDigits = (value: string) => value.replace(/\D/g, '');

// eslint no-unused-vars não aceita rest siblings; o prefixo marca a senha descartada.
function toResponsavel({
  senha: _senha,
  ...responsavel
}: Registro): Responsavel {
  return responsavel;
}

export function authenticate(
  cpf: string,
  senha: string,
): Promise<Responsavel | null> {
  const found = registros.find(
    r => r.cpf === onlyDigits(cpf) && r.senha === senha,
  );
  return new Promise(resolve => {
    setTimeout(
      () => resolve(found ? toResponsavel(found) : null),
      AUTH_DELAY_MS,
    );
  });
}

export function getResponsavel(id: number): Responsavel | null {
  const found = registros.find(r => r.id === id);
  return found ? toResponsavel(found) : null;
}
