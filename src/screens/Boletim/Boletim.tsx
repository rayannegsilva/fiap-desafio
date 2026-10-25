import { Header } from '../../components/Header/Header';
import { Text } from '../../components/Text/Text';
import { Box } from '../../theme/restyle';

export function Boletim() {
  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text variant="screenTitle">Boletim</Text>
      </Box>
    </Box>
  );
}
