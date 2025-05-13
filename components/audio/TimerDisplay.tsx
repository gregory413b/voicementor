import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';

interface TimerDisplayProps {
  seconds: number;
}

export default function TimerDisplay({ seconds }: TimerDisplayProps) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkText,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});