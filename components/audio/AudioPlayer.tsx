import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CirclePlay as PlayCircle, CirclePause as PauseCircle, SkipBack, SkipForward } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Slider from '@/components/audio/Slider';

interface AudioPlayerProps {
  duration: number;
  onTimeUpdate?: (time: number) => void;
}

export default function AudioPlayer({ duration, onTimeUpdate }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }

    if (isPlaying) {
      playbackInterval.current = setInterval(() => {
        if (isMounted.current) {
          setCurrentTime(prevTime => {
            const newTime = prevTime + (playbackRate * 0.1);
            if (newTime >= duration) {
              setIsPlaying(false);
              clearInterval(playbackInterval.current!);
              return 0;
            }
            return newTime;
          });
        }
      }, 100);
    } else if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
    }

    return () => {
      isMounted.current = false;
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, [isPlaying, playbackRate, duration, onTimeUpdate]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value * duration);
  };

  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    setCurrentTime(newTime);
  };

  const cyclePlaybackRate = () => {
    const rates = [0.5, 1.0, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveform}>
        <View style={styles.waveformBackground}>
          {Array.from({ length: 50 }).map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.waveformBar, 
                { 
                  height: 5 + Math.random() * 25,
                  backgroundColor: i / 50 < currentTime / duration 
                    ? colors.primary 
                    : colors.lightGray
                }
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <Slider 
        value={currentTime / duration}
        onValueChange={handleSeek}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.lightGray}
        thumbTintColor={colors.primary}
      />

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.rateButton} onPress={cyclePlaybackRate}>
          <Text style={styles.rateButtonText}>{playbackRate}x</Text>
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <SkipBack size={24} color={colors.darkText} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, isPlaying && styles.pauseButton]} 
            onPress={togglePlayback}
          >
            {isPlaying ? (
              <PauseCircle size={32} color="#FFFFFF" />
            ) : (
              <PlayCircle size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <SkipForward size={24} color={colors.darkText} />
          </TouchableOpacity>
        </View>

        <View style={styles.placeholder}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  waveform: {
    height: 50,
    marginBottom: 8,
    justifyContent: 'center',
  },
  waveformBackground: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveformBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.darkGray,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pauseButton: {
    backgroundColor: colors.darkGray,
  },
  rateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkText,
  },
  placeholder: {
    width: 48,
  },
});