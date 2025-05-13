import React from 'react';
import { View, StyleSheet, TouchableOpacity, PanResponder, GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { colors } from '@/constants/colors';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

export default function Slider({
  value,
  onValueChange,
  minimumTrackTintColor = colors.primary,
  maximumTrackTintColor = colors.lightGray,
  thumbTintColor = colors.primary,
}: SliderProps) {
  const [width, setWidth] = React.useState(0);
  const [isTracking, setIsTracking] = React.useState(false);

  const calculateValue = (pageX: number, width: number) => {
    const newValue = Math.max(0, Math.min(1, pageX / width));
    onValueChange(newValue);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event: GestureResponderEvent) => {
        setIsTracking(true);
        calculateValue(event.nativeEvent.pageX - event.nativeEvent.locationX, width);
      },
      onPanResponderMove: (event: GestureResponderEvent) => {
        calculateValue(event.nativeEvent.pageX - event.nativeEvent.locationX, width);
      },
      onPanResponderRelease: () => {
        setIsTracking(false);
      },
    })
  ).current;

  const handlePress = (event: GestureResponderEvent) => {
    calculateValue(event.nativeEvent.locationX, width);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onLayout={handleLayout}
      onPress={handlePress}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
        <View
          style={[
            styles.filledTrack,
            {
              width: `${value * 100}%`,
              backgroundColor: minimumTrackTintColor,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.thumb,
          {
            left: `${value * 100}%`,
            backgroundColor: thumbTintColor,
            transform: [{ translateX: -8 }],
            width: isTracking ? 20 : 16,
            height: isTracking ? 20 : 16,
            borderRadius: isTracking ? 10 : 8,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  filledTrack: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});