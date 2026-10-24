const CPF_DIGITS = 11;

export function formatCpf(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, CPF_DIGITS);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}
