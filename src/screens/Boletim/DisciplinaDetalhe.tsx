import { Text } from '../../components/Text/Text';
import type { Disciplina } from '../../data/types';
import { Box } from '../../theme/restyle';
import { formatFaltas, formatNota } from '../../utils/boletim';

type Props = { disciplina: Disciplina };

type LinhaProps = { label: string; value: string };

function Linha({ label, value }: LinhaProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Text variant="captionMedium">{label}</Text>
      <Text variant="caption">{value}</Text>
    </Box>
  );
}

export function DisciplinaDetalhe({ disciplina }: Props) {
  return (
    <>
      <Linha label="Nota:" value={formatNota(disciplina.nota)} />
      <Linha label="Faltas:" value={formatFaltas(disciplina.faltas)} />
    </>
  );
}
