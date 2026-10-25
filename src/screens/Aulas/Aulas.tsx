import { ScrollView } from 'react-native';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Header } from '../../components/Header/Header';
import { Text } from '../../components/Text/Text';
import { Box } from '../../theme/restyle';
import { formatDayLabel } from '../../utils/agenda';
import { AulaItem } from './AulaItem';
import { SemAulas } from './SemAulas';
import { useAgenda } from './useAgenda';

const TITLE_TO_DROPDOWN = 32;
const LIST_SIDE_MARGIN = 40;

export function Aulas() {
  const { days, selectedDay, selectDay } = useAgenda();

  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <Text
        variant="sectionTitle"
        textAlign="center"
        marginTop="xxl"
        accessibilityRole="header"
      >
        AGENDA
      </Text>
      {selectedDay ? (
        <>
          <Box marginHorizontal="l" style={{ marginTop: TITLE_TO_DROPDOWN }}>
            <Dropdown
              options={days}
              selected={selectedDay}
              onSelect={selectDay}
              getLabel={day => formatDayLabel(day.dia)}
              getKey={day => day.dia}
              accessibilityLabel="Dia da agenda"
            />
          </Box>
          <ScrollView
            key={selectedDay.dia}
            contentContainerStyle={{ paddingHorizontal: LIST_SIDE_MARGIN }}
          >
            <Box paddingTop="l" gap="m">
              {selectedDay.aulas.length > 0 ? (
                selectedDay.aulas.map((aula, index) => (
                  <AulaItem key={aula.horario} aula={aula} index={index} />
                ))
              ) : (
                <SemAulas />
              )}
            </Box>
          </ScrollView>
        </>
      ) : null}
    </Box>
  );
}
