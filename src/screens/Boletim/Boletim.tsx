import { ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Collapsible } from '../../components/Collapsible/Collapsible';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Header } from '../../components/Header/Header';
import { Text } from '../../components/Text/Text';
import { motion } from '../../theme/motion';
import { Box } from '../../theme/restyle';
import {
  boletimLabel,
  disciplinaLabel,
  trimestreLabel,
} from '../../utils/boletim';
import { DisciplinaDetalhe } from './DisciplinaDetalhe';
import { useBoletim } from './useBoletim';

export function Boletim() {
  const { boletins, selected, selectBoletim, listKey } = useBoletim();

  return (
    <Box flex={1} backgroundColor="background">
      <Header />
      <ScrollView>
        <Text
          variant="sectionTitle"
          textAlign="center"
          marginTop="xxl"
          accessibilityRole="header"
        >
          BOLETIM
        </Text>
        {selected ? (
          <Box marginTop="m" marginHorizontal="m">
            <Dropdown
              options={boletins}
              selected={selected}
              onSelect={selectBoletim}
              getLabel={boletimLabel}
              getKey={boletim => boletim.ano}
              accessibilityLabel="Ano do boletim"
            />
            <Box key={listKey} marginTop="m" gap="m">
              {selected.trimestres.map((trimestre, index) => (
                <Animated.View
                  key={trimestre.trimestre}
                  entering={FadeInDown.duration(
                    motion.duration.transition,
                  ).delay(index * motion.stagger)}
                >
                  <Collapsible
                    variant="card"
                    title={trimestreLabel(trimestre.trimestre)}
                  >
                    {trimestre.disciplinas.map(disciplina => (
                      <Collapsible
                        key={disciplina.nome}
                        variant="row"
                        title={disciplinaLabel(disciplina.nome)}
                      >
                        <DisciplinaDetalhe disciplina={disciplina} />
                      </Collapsible>
                    ))}
                  </Collapsible>
                </Animated.View>
              ))}
            </Box>
          </Box>
        ) : null}
      </ScrollView>
    </Box>
  );
}
