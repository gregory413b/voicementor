import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AudioVisualizerProps {
  bars: number[];
  color: string;
}

export default function AudioVisualizer({ bars, color }: AudioVisualizerProps) {
  return (
    <View style={styles.container}>
      {bars.map((height, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: Math.max(4, height * 50),
              backgroundColor: color,
              opacity: 0.7 + (height * 0.3),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: '100%',
  },
  bar: {
    width: 3,
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
});