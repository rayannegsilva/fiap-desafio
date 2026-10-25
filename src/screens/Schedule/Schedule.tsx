import { ScrollView } from 'react-native';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Header } from '../../components/Header/Header';
import { Text } from '../../components/Text/Text';
import { Box } from '../../theme/restyle';
import { formatDayLabel } from '../../utils/schedule';
import { LessonItem } from './LessonItem';
import { EmptyDay } from './EmptyDay';
import { useSchedule } from './useSchedule';

const TITLE_TO_DROPDOWN = 32;
const LIST_SIDE_MARGIN = 40;

export function Schedule() {
  const { days, selectedDay, selectDay } = useSchedule();

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
                selectedDay.aulas.map((lesson, index) => (
                  <LessonItem
                    key={`${lesson.horario}-${lesson.disciplina}`}
                    lesson={lesson}
                    index={index}
                  />
                ))
              ) : (
                <EmptyDay />
              )}
            </Box>
          </ScrollView>
        </>
      ) : null}
    </Box>
  );
}
