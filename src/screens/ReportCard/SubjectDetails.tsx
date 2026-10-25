import { Text } from '../../components/Text/Text';
import type { Subject } from '../../data/types';
import { Box } from '../../theme/restyle';
import { formatAbsences, formatGrade } from '../../utils/reportCard';

type Props = { subject: Subject };

type RowProps = { label: string; value: string };

function Row({ label, value }: RowProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <Text variant="captionMedium">{label}</Text>
      <Text variant="caption">{value}</Text>
    </Box>
  );
}

export function SubjectDetails({ subject }: Props) {
  return (
    <>
      <Row label="Nota:" value={formatGrade(subject.nota)} />
      <Row label="Faltas:" value={formatAbsences(subject.faltas)} />
    </>
  );
}
