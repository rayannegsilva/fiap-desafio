import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Header } from '../../components/Header/Header';
import { StudentSummary } from '../../components/StudentSummary/StudentSummary';
import { Text } from '../../components/Text/Text';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import { useAppTheme } from '../../theme/useAppTheme';
import { formatDayLabel } from '../../utils/schedule';
import { LessonItem } from './LessonItem';
import { EmptyDay } from './EmptyDay';
import { useSchedule } from './useSchedule';

const TITLE_TO_DROPDOWN = 32;
const LIST_SIDE_MARGIN = 40;

export function Schedule() {
  const theme = useAppTheme();
  const { days, selectedDay, selectDay } = useSchedule();

  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <ScrollView
        testID="schedule-scroll"
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.l }}
      >
        <StudentSummary />
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
            <Animated.View
              key={selectedDay.dia}
              exiting={FadeOut.duration(motion.duration.exit)}
              style={{
                paddingTop: theme.spacing.l,
                gap: theme.spacing.m,
                paddingHorizontal: LIST_SIDE_MARGIN,
              }}
            >
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
            </Animated.View>
          </>
        ) : null}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
