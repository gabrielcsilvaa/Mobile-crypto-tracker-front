import React from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import { useTheme } from '@react-navigation/native';

export default function Chart({ data }: { data: [number, number][] }) {
  const { colors } = useTheme();

  const points = data.map(([t, v]) => ({ x: new Date(t), y: v }));

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={{ x: 20, y: 24 }}
      style={{
        background: { fill: colors.background },
      }}
    >
      <VictoryAxis
        style={{
          axis: { stroke: colors.text, opacity: 0.3 },
          tickLabels: { fill: colors.text, fontSize: 10, opacity: 0.6 },
          grid: { stroke: 'none' },
        }}
      />

      <VictoryAxis
        dependentAxis
        style={{
          axis: { stroke: colors.text, opacity: 0.3 },
          tickLabels: { fill: colors.text, fontSize: 10, opacity: 0.6 },
          grid: { stroke: colors.border, opacity: 0.1 },
        }}
      />

      <VictoryLine
        data={points}
        interpolation="monotoneX"
        style={{
          data: {
            stroke: colors.primary ?? '#3b82f6', 
            strokeWidth: 2,
          },
        }}
      />
    </VictoryChart>
  );
}
