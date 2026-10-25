import { Text } from '../../components/Text/Text';
import type { Subject } from '../../data/types';
import { Box } from '../../theme/restyle';
import { formatAbsences, formatGrade } from '../../utils/reportCard';

type Props = { disciplina: Subject };

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
      <Linha label="Nota:" value={formatGrade(disciplina.nota)} />
      <Linha label="Faltas:" value={formatAbsences(disciplina.faltas)} />
    </>
  );
}
