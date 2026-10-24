import { Text } from '../../components/Text/Text';
import { Box } from '../../theme/restyle';

export function TrocaAluno() {
  return (
    <Box
      flex={1}
      backgroundColor="background"
      justifyContent="center"
      alignItems="center"
    >
      <Text variant="screenTitle">Troca de aluno</Text>
    </Box>
  );
}
