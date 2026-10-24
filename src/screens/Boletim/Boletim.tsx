import { Text } from '../../components/Text/Text';
import { Box } from '../../theme/restyle';

export function Boletim() {
  return (
    <Box
      flex={1}
      backgroundColor="background"
      justifyContent="center"
      alignItems="center"
    >
      <Text variant="screenTitle">Boletim</Text>
    </Box>
  );
}
